"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { propellaDB, type GenerationRecord, isIndexedDBSupported, migrateFromLocalStorage } from '@/lib/indexedDB';
import { PageLoadAnimation, PulseButton, CountUp } from '@/components/AnimatedElements';
import { useDebounce, usePerformanceMonitor } from '@/components/VirtualGrid';
import ImageCard, { ImageGrid } from '@/components/ImageCard';
import { SkeletonCard, SkeletonLoader } from '@/components/Skeleton';
import ImageDetailModal from '@/components/ImageDetailModal';

function GeneratePageContent() {
  usePerformanceMonitor('GeneratePage');

  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [itemName, setItemName] = useState('');
  const [style, setStyle] = useState('pixel');
  const [level, setLevel] = useState('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 自动隐藏功能状态
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 图像详情模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GenerationRecord | null>(null);

  // 防抖搜索
  useDebounce(itemName, 300);

  // 处理URL参数 - 支持从其他页面传递提示词和参数
  useEffect(() => {
    const prompt = searchParams.get('prompt');
    const urlStyle = searchParams.get('style');
    const urlLevel = searchParams.get('level');

    if (prompt) {
      setItemName(decodeURIComponent(prompt));
    }
    if (urlStyle) {
      setStyle(urlStyle);
    }
    if (urlLevel) {
      setLevel(urlLevel);
    }
  }, [searchParams]);

  // 滚动监听 - 自动隐藏顶部输入区
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollY = scrollContainerRef.current.scrollTop;
      const scrollThreshold = 100; // 滚动阈值
      
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // 向下滚动且超过阈值 - 隐藏
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= scrollThreshold) {
        // 向上滚动或回到顶部 - 显示
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  // 加载历史记录
  useEffect(() => {
    if (status === 'authenticated') {
      loadGenerations();
    }
  }, [status]);

  // 提前 return 只做渲染，hooks 必须在 return 之前全部调用
  if (status === 'loading') {
    return <SkeletonLoader />;
  }
  if (status === 'unauthenticated' || !session) {
    if (typeof window !== 'undefined') {
      redirect('/login');
    }
    return null;
  }

  const loadGenerations = async () => {
    setIsLoading(true);
    try {
      let records: GenerationRecord[] = [];

      if (isIndexedDBSupported()) {
        await migrateFromLocalStorage();
        records = await propellaDB.getAllGenerations();
      } else {
        const localHistory = localStorage.getItem('history');
        if (localHistory) {
          const data = JSON.parse(localHistory);
          records = data || [];
        }
      }

      // 验证和清理数据 - 确保所有记录都有有效的图像URL
      const validRecords = records.filter(record => {
        const hasValidUrl = record.imageUrl &&
          (record.imageUrl.startsWith('http') || record.imageUrl.startsWith('data:'));

        if (!hasValidUrl) {
          console.warn('发现无效的图像记录:', record);
        }

        return hasValidUrl;
      });

      console.log(`加载了 ${validRecords.length} 条有效记录，过滤了 ${records.length - validRecords.length} 条无效记录`);
      setGenerations(validRecords);

    } catch (error) {
      console.error('加载历史记录失败:', error);
      setGenerations([]); // 设置为空数组而不是保持loading状态
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const handleGenerate = async () => {
    if (!itemName.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: itemName, style, level })
      });
      
      const data = await response.json();
      console.log('API响应数据:', data); // 调试日志

      // 更健壮的图像URL提取逻辑
      let imageUrl = '';
      if (data.success) {
        imageUrl = data.imageUrl ||
                  (data.data && data.data[0] && data.data[0].url) ||
                  data.url ||
                  '';
      }

      if (data.success && imageUrl) {
        // 验证URL的有效性
        const isValidUrl = imageUrl.startsWith('http') || imageUrl.startsWith('data:');

        if (!isValidUrl) {
          console.error('无效的图像URL:', imageUrl);
          alert('生成失败: 返回的图像URL无效');
          return;
        }

        const newGeneration: GenerationRecord = {
          id: crypto.randomUUID(),
          name: itemName,
          style,
          level,
          imageUrl: imageUrl,
          timestamp: Date.now()
        };

        // 保存到数据库
        try {
          if (isIndexedDBSupported()) {
            await propellaDB.addGeneration({
              name: itemName,
              style,
              level,
              imageUrl: imageUrl
            });
          } else {
            const currentHistory = JSON.parse(localStorage.getItem('history') || '[]');
            currentHistory.unshift(newGeneration);
            localStorage.setItem('history', JSON.stringify(currentHistory));
          }
        } catch (error) {
          console.error('保存到数据库失败:', error);
          // 不阻止UI更新
        }

        // 更新UI状态
        setGenerations(prev => [newGeneration, ...prev]);
        setItemName('');

        // 生成完成后显示头部
        setIsHeaderVisible(true);

        console.log('新生成记录已添加:', newGeneration);
      } else {
        console.error('生成失败，API响应:', data);
        alert('生成失败: ' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('网络错误，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 快速回到顶部
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 处理图像卡片点击 - 打开详情模态框
  const handleImageClick = (generation: GenerationRecord) => {
    setSelectedImage(generation);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // 使用提示词 - 从模态框复制到输入框
  const handleUsePrompt = (prompt: string) => {
    setItemName(prompt);
    setIsHeaderVisible(true); // 确保头部可见
  };

  return (
    <PageLoadAnimation>
      <div className="flex flex-col h-screen bg-surface-primary relative">
      {/* 顶部工具栏 - 现代化设计 */}
      <header
        id="prompt-controls"
        className={`sticky top-0 z-30 glass border-b border-border-primary transition-all duration-300 ease-in-out ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* 页面标题区域 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Create</h1>
              <p className="text-text-secondary text-sm sm:text-base">Generate amazing game items with AI</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-secondary/50 rounded-xl border border-border-primary">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-text-secondary">
                  <CountUp end={generations.length} /> items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollToTop}
                  className="btn btn-ghost btn-sm"
                  title="Scroll to top"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="hidden sm:inline">Top</span>
                </button>
                <button className="btn btn-ghost btn-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* 提示词输入区 - 现代化设计 */}
          <div className="space-y-6">
            {/* 主要输入框 */}
            <div className="relative group">
              <textarea
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Describe your item in detail... e.g., 'a legendary sword with glowing blue runes and ancient engravings'"
                className="textarea h-32 text-base placeholder:text-text-tertiary resize-none"
                disabled={isGenerating}
                maxLength={500}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <div className="text-xs text-text-tertiary">
                  {itemName.length}/500
                </div>
                {itemName.length > 0 && (
                  <button
                    onClick={() => setItemName('')}
                    className="p-1 rounded-lg hover:bg-surface-tertiary text-text-tertiary hover:text-text-secondary transition-colors"
                    title="Clear"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 控制选项 - 响应式布局 */}
            <div className="space-y-4">
              {/* 移动端：垂直布局，桌面端：网格布局 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 风格选择 */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Art Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="select"
                    disabled={isGenerating}
                  >
                    <option value="pixel">🎮 Pixel Art</option>
                    <option value="cyberpunk">🤖 Cyberpunk</option>
                    <option value="fantasy">🧙 Fantasy</option>
                    <option value="scifi">🚀 Sci-Fi</option>
                    <option value="cartoon">🎨 Cartoon</option>
                  </select>
                </div>

                {/* 稀有度选择 */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Rarity Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="select"
                    disabled={isGenerating}
                  >
                    <option value="normal">⚪ Normal</option>
                    <option value="elite">🔵 Elite</option>
                    <option value="epic">🟣 Epic</option>
                    <option value="legendary">🟡 Legendary</option>
                  </select>
                </div>

                {/* 生成按钮 - 在移动端占满宽度 */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label className="text-sm font-semibold text-text-secondary">Action</label>
                  <PulseButton
                    onClick={handleGenerate}
                    disabled={isGenerating || !itemName.trim()}
                    className="w-full btn-lg"
                    variant="primary"
                  >
                    {isGenerating ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span className="hidden sm:inline">Generating...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate
                      </>
                    )}
                  </PulseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 - 现代化网格布局 */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        id="results-feed"
      >
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <ImageGrid>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </ImageGrid>
            ) : generations.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-lg mx-auto space-y-8">
                  {/* 空状态图标 */}
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl flex items-center justify-center border border-border-primary">
                      <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-3xl -z-10 animate-pulse"></div>
                  </div>

                  {/* 空状态文本 */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-text-primary">
                      Ready to create something amazing?
                    </h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                      Describe any game item you can imagine and watch AI bring it to life.
                      From legendary weapons to mystical artifacts.
                    </p>
                  </div>

                  {/* 示例标签 */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {['Weapons', 'Armor', 'Potions', 'Artifacts', 'Tools', 'Accessories'].map((tag) => (
                      <span key={tag} className="px-4 py-2 bg-surface-secondary border border-border-primary rounded-xl text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 结果统计 */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Your Creations ({generations.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filter
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      Sort
                    </button>
                  </div>
                </div>

                {/* 结果网格 - 使用新的ImageCard组件 */}
                <ImageGrid>
                  {generations.map((gen, index) => (
                    <ImageCard
                      key={gen.id}
                      imageUrl={gen.imageUrl}
                      alt={gen.name || 'Generated image'}
                      index={index}
                      priority={index < 4}
                      onClick={() => handleImageClick(gen)}
                      onLike={(liked) => {
                        console.log(`Image ${gen.id} ${liked ? 'liked' : 'unliked'}`);
                        // 这里可以添加保存喜欢状态的逻辑
                      }}
                      onDownload={() => {
                        const link = document.createElement('a');
                        link.href = gen.imageUrl;
                        link.download = `${gen.name || 'image'}-${gen.style}-${gen.level}.png`;
                        link.click();
                      }}
                    />
                  ))}
                </ImageGrid>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 浮动操作按钮 - 响应式设计 */}
      {!isHeaderVisible && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-3">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-glow transition-all duration-200 flex items-center justify-center group"
            title="Back to top"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>

          <button
            onClick={() => setIsHeaderVisible(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-surface-secondary hover:bg-surface-tertiary border border-border-primary text-text-secondary hover:text-text-primary rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group"
            title="Show controls"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>
      )}

      {/* 图像详情模态框 */}
      <ImageDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageData={selectedImage}
        onUsePrompt={handleUsePrompt}
      />
      </div>
    </PageLoadAnimation>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <GeneratePageContent />
    </Suspense>
  );
}

// 旧的组件已被新的ImageCard组件替代




