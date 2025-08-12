"use client";

// 骨架屏组件
export function SkeletonCard() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-tertiary">
      {/* 图片骨架 */}
      <div className="absolute inset-0 skeleton"></div>
    </div>
  );
}

// 页面加载骨架屏
export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-border-primary border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}

// 网格骨架屏
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// 文本骨架屏
export function SkeletonText({ 
  lines = 1, 
  className = "" 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 skeleton rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// 按钮骨架屏
export function SkeletonButton({ 
  className = "" 
}: { 
  className?: string; 
}) {
  return (
    <div className={`h-10 skeleton rounded-xl ${className}`} />
  );
}

// 头像骨架屏
export function SkeletonAvatar({ 
  size = "md" 
}: { 
  size?: "sm" | "md" | "lg"; 
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} skeleton rounded-full`} />
  );
}
