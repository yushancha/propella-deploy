"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import type { GenerationRecord } from '@/lib/indexedDB';
import { propellaDB, isIndexedDBSupported, migrateFromLocalStorage } from '@/lib/indexedDB';
import { PageLoadAnimation, CountUp } from '@/components/AnimatedElements';
import ImageCard from '@/components/ImageCard';
import { SkeletonCard } from '@/components/Skeleton';
import ImageDetailModal from '@/components/ImageDetailModal';

/**
 * Organize页面 - 高密度作品档案馆
 * 重构自历史页面，提供高密度的视觉化作品管理
 * 实现懒加载和无限滚动以处理大量图像资产
 */
export default function OrganizePage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [displayedGenerations, setDisplayedGenerations] = useState<GenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GenerationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 过滤和排序状态
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 无限滚动状态
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 24; // 高密度显示，每页更多项目
  
  // 滚动检测
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 重定向未登录用户
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  // 加载所有生成作品
  const loadAllGenerations = async () => {
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
      
      console.log(`档案馆加载了 ${validRecords.length} 条有效记录`);
      setGenerations(validRecords);
      
      // 初始化显示第一页
      const firstPage = validRecords.slice(0, ITEMS_PER_PAGE);
      setDisplayedGenerations(firstPage);
      setHasMore(validRecords.length > ITEMS_PER_PAGE);
      setCurrentPage(1);
      
    } catch (error) {
      console.error('加载档案馆失败:', error);
      setGenerations([]);
      setDisplayedGenerations([]);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // 获取过滤后的生成记录
  const getFilteredGenerations = useCallback(() => {
    return generations
      .filter(gen => {
        if (filterStyle !== 'all' && gen.style !== filterStyle) return false;
        if (filterLevel !== 'all' && gen.level !== filterLevel) return false;
        if (searchQuery && !gen.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
  }, [generations, filterStyle, filterLevel, searchQuery, sortBy]);

  // 加载更多项目
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      const filteredGenerations = getFilteredGenerations();
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = filteredGenerations.slice(startIndex, endIndex);
      
      if (newItems.length > 0) {
        setDisplayedGenerations(prev => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        setHasMore(endIndex < filteredGenerations.length);
      } else {
        setHasMore(false);
      }
      
      setIsLoadingMore(false);
    }, 300);
  }, [currentPage, isLoadingMore, hasMore, generations, filterStyle, filterLevel, sortBy, searchQuery]);

  // 设置无限滚动观察器
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMoreItems, hasMore, isLoadingMore]);

  // 重新应用过滤器
  const applyFilters = useCallback(() => {
    const filteredGenerations = getFilteredGenerations();
    const firstPage = filteredGenerations.slice(0, ITEMS_PER_PAGE);
    setDisplayedGenerations(firstPage);
    setHasMore(filteredGenerations.length > ITEMS_PER_PAGE);
    setCurrentPage(1);
  }, [getFilteredGenerations, ITEMS_PER_PAGE]);

  // 监听过滤器变化
  useEffect(() => {
    if (generations.length > 0) {
      applyFilters();
    }
  }, [filterStyle, filterLevel, sortBy, searchQuery, generations, applyFilters]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadAllGenerations();
    }
  }, [status]);

  // 处理图像点击
  const handleImageClick = (generation: GenerationRecord) => {
    setSelectedImage(generation);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // 获取唯一的风格和等级选项
  const uniqueStyles = Array.from(new Set(generations.map(gen => gen.style)));
  const uniqueLevels = Array.from(new Set(generations.map(gen => gen.level)));
  const filteredCount = getFilteredGenerations().length;

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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          
          {/* 页面头部 */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Archive</h1>
                <p className="text-text-secondary text-sm sm:text-base">
                  Your complete collection of generated artwork
                </p>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={loadAllGenerations}
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
                    <CountUp end={filteredCount} /> of {generations.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-text-secondary">
                    Archive since: {new Date(Math.min(...generations.map(g => g.timestamp))).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-text-secondary">
                    Last added: {new Date(Math.max(...generations.map(g => g.timestamp))).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 搜索和过滤控件 */}
          {!isLoading && generations.length > 0 && (
            <div className="mb-6 space-y-4">
              {/* 搜索框 */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search your archive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-sm w-full pl-10"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* 过滤器 */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface-secondary/30 rounded-xl border border-border-primary">
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
            </div>
          )}

          {/* 内容区域 */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : displayedGenerations.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto space-y-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl flex items-center justify-center border border-border-primary">
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14-7H5m14 14H5" />
                  </svg>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {generations.length === 0 ? 'Archive is empty' : 'No items match your filters'}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {generations.length === 0 
                      ? 'Start creating artwork to build your archive. All your creations will be stored here.'
                      : 'Try adjusting your search or filters to find what you&apos;re looking for.'
                    }
                  </p>
                </div>
                
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
                        setSearchQuery('');
                      }}
                      className="btn btn-secondary"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 高密度网格 - 更多列数以实现高密度显示 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                {displayedGenerations.map((gen, index) => (
                  <ImageCard
                    key={gen.id || `${gen.timestamp}-${index}`}
                    imageUrl={gen.imageUrl}
                    alt={gen.name || 'Generated artwork'}
                    index={index}
                    priority={index < 16} // 前16张图片优先加载
                    onClick={() => handleImageClick(gen)}
                    onLike={(liked) => {
                      console.log(`Archive image ${gen.id} ${liked ? 'liked' : 'unliked'}`);
                    }}
                    onDownload={() => {
                      const link = document.createElement('a');
                      link.href = gen.imageUrl;
                      link.download = `archive-${gen.name || 'artwork'}-${gen.style}-${gen.level}.png`;
                      link.click();
                    }}
                  />
                ))}
              </div>

              {/* 无限滚动加载指示器 */}
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isLoadingMore && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <div className="loading-spinner w-5 h-5"></div>
                    <span>Loading more items...</span>
                  </div>
                )}
                {!hasMore && displayedGenerations.length > 0 && (
                  <div className="text-text-tertiary text-sm">
                    You&apos;ve reached the end of your archive
                  </div>
                )}
              </div>
            </>
          )}

          {/* 图像详情模态框 */}
          <ImageDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            imageData={selectedImage}
            onUsePrompt={(prompt) => {
              window.location.href = `/generate?prompt=${encodeURIComponent(prompt)}`;
            }}
          />
        </div>
      </div>
    </PageLoadAnimation>
  );
}
