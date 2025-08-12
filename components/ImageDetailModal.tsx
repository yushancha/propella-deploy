"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedImage from './OptimizedImage';
import { GenerationRecord } from '@/lib/indexedDB';

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: GenerationRecord | null;
  onUsePrompt?: (prompt: string) => void;
}

/**
 * 图像详情模态框组件
 * 完全复刻"即梦"平台的设计和功能
 */
export default function ImageDetailModal({
  isOpen,
  onClose,
  imageData,
  onUsePrompt
}: ImageDetailModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(42); // 模拟数据
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const router = useRouter();

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 处理背景点击关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 处理喜欢按钮
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 处理关注按钮
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // 复制提示词到剪贴板
  const handleCopyPrompt = async () => {
    if (imageData?.name) {
      try {
        await navigator.clipboard.writeText(imageData.name);
        // 这里可以添加toast提示
        console.log('提示词已复制到剪贴板');
      } catch (error) {
        console.error('复制失败:', error);
      }
    }
  };

  // 使用提示词 - 跳转到创建页面并填充
  const handleUsePrompt = () => {
    if (imageData?.name) {
      onUsePrompt?.(imageData.name);
      onClose();
      router.push('/generate');
    }
  };

  // 下载图片
  const handleDownload = () => {
    if (imageData?.imageUrl) {
      const link = document.createElement('a');
      link.href = imageData.imageUrl;
      link.download = `${imageData.name || 'image'}-${imageData.style}-${imageData.level}.png`;
      link.click();
    }
  };

  // 使用同款 - 复制参数到创建页面
  const handleUseSameStyle = () => {
    // 这里可以传递风格和等级参数
    onClose();
    router.push(`/generate?style=${imageData?.style}&level=${imageData?.level}`);
  };

  if (!isOpen || !imageData) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* 模态框面板 - 从右侧滑入 */}
      <div className={`ml-auto h-full w-full max-w-lg bg-surface-primary border-l border-border-primary shadow-modal transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* 头部区域 */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <div className="flex items-center gap-3">
            {/* 作者头像 */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              AI
            </div>
            
            {/* 用户信息 */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary">AI Creator</h3>
              <p className="text-xs text-text-tertiary">Propella AI</p>
            </div>
            
            {/* 关注按钮 */}
            <button
              onClick={handleFollow}
              className={`ml-4 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isFollowing 
                  ? 'bg-surface-tertiary text-text-primary border border-border-primary' 
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
          
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 滚动内容区域 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          
          {/* 主图像区域 */}
          <div className="p-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-tertiary">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-surface-tertiary animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-border-primary border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              )}
              
              <OptimizedImage
                src={imageData.imageUrl}
                alt={imageData.name || 'Generated image'}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                quality={95}
                priority
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            
            {/* 喜欢按钮和统计 */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'hover:bg-surface-secondary text-text-secondary hover:text-text-primary'
                }`}
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
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              
              <div className="text-xs text-text-tertiary">
                {new Date(imageData.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* 元数据区域 */}
          <div className="px-6 pb-6 space-y-6">
            
            {/* 提示词区块 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-primary">Prompt</h4>
                <button
                  onClick={handleCopyPrompt}
                  className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors"
                  title="Copy prompt"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 bg-surface-secondary rounded-xl border border-border-primary">
                <p className="text-sm text-text-primary leading-relaxed">
                  {imageData.name}
                </p>
              </div>
            </div>

            {/* 其他元数据 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Style</h5>
                <div className="px-3 py-2 bg-surface-secondary rounded-lg border border-border-primary">
                  <span className="text-sm text-text-primary capitalize">{imageData.style}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Rarity</h5>
                <div className="px-3 py-2 bg-surface-secondary rounded-lg border border-border-primary">
                  <span className="text-sm text-text-primary capitalize">{imageData.level}</span>
                </div>
              </div>
            </div>

            {/* 技术参数 */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text-primary">Technical Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Model</span>
                  <span className="text-text-secondary">Propella AI v2.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Seed</span>
                  <span className="text-text-secondary font-mono">
                    {Math.floor(Math.random() * 1000000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Resolution</span>
                  <span className="text-text-secondary">1024×1024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作栏区域 - 固定在底部 */}
        <div className="p-6 border-t border-border-primary bg-surface-primary">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleUsePrompt}
              className="btn btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Use Prompt
            </button>
            
            <button
              onClick={handleUseSameStyle}
              className="btn btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Same Style
            </button>
          </div>
          
          <button
            onClick={handleDownload}
            className="btn btn-ghost w-full mt-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}
