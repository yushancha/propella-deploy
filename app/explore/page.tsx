"use client";
import { useState, useEffect } from 'react';
import { PageLoadAnimation } from '@/components/AnimatedElements';
import ImageCard, { ImageGrid } from '@/components/ImageCard';
import { SkeletonCard } from '@/components/Skeleton';

/**
 * Explore页面 - 发现社区作品
 * 按照Midjourney结构，这是发现和浏览社区内容的页面
 */
export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredWorks, setFeaturedWorks] = useState([]);

  useEffect(() => {
    // 模拟加载社区作品
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <PageLoadAnimation>
      <div className="min-h-screen bg-surface-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          
          {/* 页面头部 */}
          <div className="mb-6 sm:mb-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Explore</h1>
              <p className="text-text-secondary text-sm sm:text-base">
                Discover amazing creations from the community
              </p>
            </div>
          </div>

          {/* 内容区域 */}
          {isLoading ? (
            <ImageGrid>
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </ImageGrid>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto space-y-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl flex items-center justify-center border border-border-primary">
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-text-primary">Coming Soon</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    The community gallery is being prepared. Soon you&apos;ll be able to explore and discover amazing creations from other users.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <a href="/generate" className="btn btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Creating
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLoadAnimation>
  );
}
