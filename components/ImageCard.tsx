"use client";
import { useState } from 'react';
import OptimizedImage from './OptimizedImage';
import { HoverCard } from './AnimatedElements';

interface ImageCardProps {
  imageUrl: string;
  alt: string;
  index?: number;
  onLike?: (liked: boolean) => void;
  onDownload?: () => void;
  onClick?: () => void;
  className?: string;
  showActions?: boolean;
  priority?: boolean;
}

/**
 * 现代化图像卡片组件
 * 符合即梦平台的设计标准：
 * - 默认状态只显示图像
 * - 悬停时显示爱心图标在右下角
 * - 支持下载和其他操作
 */
export default function ImageCard({
  imageUrl,
  alt,
  index = 0,
  onLike,
  onDownload,
  onClick,
  className = "",
  showActions = true,
  priority = false
}: ImageCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 验证URL的有效性
  const isValidUrl = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:'));

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onLike?.(newLikedState);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    } else {
      // 默认下载行为
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `image-${Date.now()}.png`;
      link.click();
    }
  };

  const handleCardClick = () => {
    onClick?.();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    console.error('图像加载失败:', imageUrl);
  };

  const handleRetry = () => {
    setImageError(false);
    setImageLoaded(false);
    // 触发重新加载
    const img = new window.Image();
    img.onload = () => handleImageLoad();
    img.onerror = () => handleImageError();
    img.src = imageUrl;
  };

  return (
    <HoverCard delay={index * 30} className={className}>
      <article
        className="group relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* 主图像容器 - 默认状态只显示图像 */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-tertiary">
          {/* 条件渲染：确保URL有效才渲染图像 */}
          {isValidUrl ? (
            <>
              {/* 加载状态骨架屏 */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-surface-tertiary animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-border-primary border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              )}

              {/* 实际图像 */}
              <OptimizedImage
                src={imageUrl}
                alt={alt}
                fill
                className={`object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } ${isHovered ? 'scale-110' : 'scale-100'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                quality={90}
                priority={priority}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            /* 无效URL的错误状态 */
            <div className="absolute inset-0 bg-surface-tertiary flex flex-col items-center justify-center text-text-tertiary">
              <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xs opacity-75">Image not available</p>
            </div>
          )}

          {/* 悬停覆盖层 - 仅在悬停时显示操作 */}
          {showActions && (
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* 爱心图标 - 定位在右下角（符合即梦设计） */}
              <button
                onClick={handleLike}
                className={`absolute bottom-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-500/90 text-white scale-110' 
                    : 'bg-black/40 text-white hover:bg-black/60 hover:scale-110'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <svg 
                  className="w-5 h-5" 
                  fill={isLiked ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </button>

              {/* 可选：下载按钮 - 定位在右上角 */}
              <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  title="Download"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* 加载失败时的重试按钮 */}
          {imageError && isValidUrl && (
            <button
              onClick={handleRetry}
              className="absolute inset-0 bg-surface-tertiary/80 flex flex-col items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs">Retry</span>
            </button>
          )}
        </div>

        {/* 调试信息 - 仅在开发环境显示 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 p-2 bg-surface-secondary rounded text-xs text-text-tertiary">
            <div>URL: {imageUrl || 'No URL'}</div>
            <div>Valid: {isValidUrl ? 'Yes' : 'No'}</div>
            <div>Loaded: {imageLoaded ? 'Yes' : 'No'}</div>
            <div>Error: {imageError ? 'Yes' : 'No'}</div>
          </div>
        )}
      </article>
    </HoverCard>
  );
}

// 简化版本的图像卡片，只显示图像和爱心
export function SimpleImageCard({
  imageUrl,
  alt,
  index = 0,
  onLike,
  className = ""
}: Pick<ImageCardProps, 'imageUrl' | 'alt' | 'index' | 'onLike' | 'className'>) {
  return (
    <ImageCard
      imageUrl={imageUrl}
      alt={alt}
      index={index}
      onLike={onLike}
      className={className}
      showActions={true}
      priority={index < 4}
    />
  );
}

// 网格容器组件
export function ImageGrid({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  );
}
