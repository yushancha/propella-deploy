"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { propellaDB, type GenerationRecord, isIndexedDBSupported, migrateFromLocalStorage } from '@/lib/indexedDB';
import { PageLoadAnimation, CountUp } from '@/components/AnimatedElements';
import ImageCard, { ImageGrid } from '@/components/ImageCard';
import { SkeletonCard } from '@/components/Skeleton';
import ImageDetailModal from '@/components/ImageDetailModal';

/**
 * Edit页面 - 个人作品画廊
 * 复用模块一的图像卡片组件，保持UI/UX一致性
 * 注意：这里的"Edit"是按照Midjourney结构命名，实际功能是个人作品展示
 */
export default function EditPage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GenerationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // 重定向未登录用户
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  // 加载用户的所有生成作品
  const loadUserGenerations = async () => {
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
      
      // 验证和清理数据
      const validRecords = records.filter(record => {
        const hasValidUrl = record.imageUrl && 
          (record.imageUrl.startsWith('http') || record.imageUrl.startsWith('data:'));
        
        if (!hasValidUrl) {
          console.warn('发现无效的图像记录:', record);
        }
        
        return hasValidUrl;
      });
      
      console.log(`加载了 ${validRecords.length} 条有效记录`);
      setGenerations(validRecords);
      
    } catch (error) {
      console.error('加载个人作品失败:', error);
      setGenerations([]);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadUserGenerations();
    }
  }, [status]);

  // 处理图像点击 - 打开详情模态框
  const handleImageClick = (generation: GenerationRecord) => {
    setSelectedImage(generation);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // 删除作品
  const handleDeleteGeneration = async (generation: GenerationRecord) => {
    if (confirm('Are you sure you want to delete this creation?')) {
      try {
        if (isIndexedDBSupported() && generation.id) {
          await propellaDB.deleteGeneration(generation.id);
        } else {
          const localHistory = JSON.parse(localStorage.getItem('history') || '[]');
          const updatedHistory = localHistory.filter((item: GenerationRecord) => 
            item.timestamp !== generation.timestamp
          );
          localStorage.setItem('history', JSON.stringify(updatedHistory));
        }
        
        // 更新本地状态
        setGenerations(prev => prev.filter(item => 
          item.id !== generation.id && item.timestamp !== generation.timestamp
        ));
        
        console.log('作品已删除');
      } catch (error) {
        console.error('删除作品失败:', error);
      }
    }
  };

  // 过滤和排序逻辑
  const filteredAndSortedGenerations = generations
    .filter(gen => {
      if (filterStyle !== 'all' && gen.style !== filterStyle) return false;
      if (filterLevel !== 'all' && gen.level !== filterLevel) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // 获取唯一的风格和等级选项
  const uniqueStyles = Array.from(new Set(generations.map(gen => gen.style)));
  const uniqueLevels = Array.from(new Set(generations.map(gen => gen.level)));

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <PageLoadAnimation>
      <div className="min-h-screen bg-surface-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          
          {/* 页面头部 */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Creations</h1>
                <p className="text-text-secondary text-sm sm:text-base">
                  Manage and organize your generated artwork
                </p>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={loadUserGenerations}
                  className="btn btn-ghost btn-sm"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
            
            {/* 统计信息 */}
            {!isLoading && generations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 bg-surface-secondary/50 rounded-xl border border-border-primary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-text-secondary">
                    <CountUp end={filteredAndSortedGenerations.length} /> of {generations.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-text-secondary">
                    Last created: {new Date(Math.max(...generations.map(g => g.timestamp))).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 过滤和排序控件 */}
          {!isLoading && generations.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4 p-4 bg-surface-secondary/30 rounded-xl border border-border-primary">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-secondary">Style:</label>
                <select
                  value={filterStyle}
                  onChange={(e) => setFilterStyle(e.target.value)}
                  className="select select-sm"
                >
                  <option value="all">All Styles</option>
                  {uniqueStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-secondary">Rarity:</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="select select-sm"
                >
                  <option value="all">All Levels</option>
                  {uniqueLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-secondary">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
                  className="select select-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">By Name</option>
                </select>
              </div>
            </div>
          )}

          {/* 内容区域 */}
          {isLoading ? (
            <ImageGrid>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </ImageGrid>
          ) : filteredAndSortedGenerations.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto space-y-8">
                {/* 空状态图标 */}
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl flex items-center justify-center border border-border-primary">
                    <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-3xl -z-10 animate-pulse"></div>
                </div>
                
                {/* 空状态文本 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {generations.length === 0 ? 'No creations yet' : 'No items match your filters'}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {generations.length === 0 
                      ? 'Start creating some amazing artwork! Your creations will appear here.'
                      : 'Try adjusting your filters to see more items.'
                    }
                  </p>
                </div>
                
                {/* 行动按钮 */}
                <div className="flex justify-center">
                  {generations.length === 0 ? (
                    <a href="/generate" className="btn btn-primary btn-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Creating
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setFilterStyle('all');
                        setFilterLevel('all');
                      }}
                      className="btn btn-secondary"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <ImageGrid>
              {filteredAndSortedGenerations.map((gen, index) => (
                <ImageCard
                  key={gen.id || `${gen.timestamp}-${index}`}
                  imageUrl={gen.imageUrl}
                  alt={gen.name || 'Generated artwork'}
                  index={index}
                  priority={index < 4}
                  onClick={() => handleImageClick(gen)}
                  onLike={(liked) => {
                    console.log(`Image ${gen.id} ${liked ? 'liked' : 'unliked'}`);
                  }}
                  onDownload={() => {
                    const link = document.createElement('a');
                    link.href = gen.imageUrl;
                    link.download = `${gen.name || 'artwork'}-${gen.style}-${gen.level}.png`;
                    link.click();
                  }}
                />
              ))}
            </ImageGrid>
          )}

          {/* 图像详情模态框 */}
          <ImageDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            imageData={selectedImage}
            onUsePrompt={(prompt) => {
              // 跳转到创建页面并填充提示词
              window.location.href = `/generate?prompt=${encodeURIComponent(prompt)}`;
            }}
          />
        </div>
      </div>
    </PageLoadAnimation>
  );
}
