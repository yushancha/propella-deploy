"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
// import { FixedSizeGrid as Grid } from 'react-window'; // Commented out because dependency not installed
import { GenerationRecord } from '@/lib/indexedDB';
import ImageCard from './ImageCard';

interface VirtualizedImageGridProps {
  items: GenerationRecord[];
  onImageClick: (item: GenerationRecord) => void;
  onImageLike?: (item: GenerationRecord, liked: boolean) => void;
  onImageDownload?: (item: GenerationRecord) => void;
  className?: string;
}

interface GridCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    items: GenerationRecord[];
    columnsCount: number;
    onImageClick: (item: GenerationRecord) => void;
    onImageLike?: (item: GenerationRecord, liked: boolean) => void;
    onImageDownload?: (item: GenerationRecord) => void;
  };
}

/**
 * Virtualized image grid component
 * For high-performance rendering of large numbers of images, supports lazy loading and infinite scrolling
 */
export default function VirtualizedImageGrid({
  items,
  onImageClick,
  onImageLike,
  onImageDownload,
  className = ""
}: VirtualizedImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [columnsCount, setColumnsCount] = useState(4);

  // Responsive column count calculation
  const calculateColumns = (width: number) => {
    if (width < 640) return 2;      // sm
    if (width < 768) return 3;      // md
    if (width < 1024) return 4;     // lg
    if (width < 1280) return 5;     // xl
    if (width < 1536) return 6;     // 2xl
    return 8;                       // Extra large screens
  };

  // Listen for container size changes
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
        setColumnsCount(calculateColumns(width));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate grid parameters
  const itemWidth = useMemo(() => {
    const gap = 16; // 4 * 4px (gap-4)
    const totalGaps = (columnsCount - 1) * gap;
    return Math.floor((containerSize.width - totalGaps) / columnsCount);
  }, [containerSize.width, columnsCount]);

  const itemHeight = itemWidth; // Square images
  const rowCount = Math.ceil(items.length / columnsCount);

  // Grid cell render function
  const GridCell = ({ columnIndex, rowIndex, style, data }: GridCellProps) => {
    const { items, columnsCount, onImageClick, onImageLike, onImageDownload } = data;
    const itemIndex = rowIndex * columnsCount + columnIndex;
    const item = items[itemIndex];

    if (!item) {
      return <div style={style} />;
    }

    return (
      <div style={style} className="p-2">
        <ImageCard
          imageUrl={item.imageUrl}
          alt={item.name || 'Generated artwork'}
          index={itemIndex}
          priority={itemIndex < 16}
          onClick={() => onImageClick(item)}
          onLike={(liked) => onImageLike?.(item, liked)}
          onDownload={() => onImageDownload?.(item)}
          className="h-full"
        />
      </div>
    );
  };

  // If container size is not yet determined, show loading state
  if (containerSize.width === 0) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ${className}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // Grid component temporarily disabled because react-window dependency not installed
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="p-2">
          <ImageCard
            imageUrl={item.imageUrl}
            alt={item.name || 'Generated artwork'}
            index={index}
            priority={index < 16}
            onClick={() => onImageClick(item)}
            onLike={(liked) => onImageLike?.(item, liked)}
            onDownload={() => onImageDownload?.(item)}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Auto-sized virtual grid
 * Adjusts height automatically based on container size
 */
export function AutoSizedVirtualGrid({
  items,
  onImageClick,
  onImageLike,
  onImageDownload,
  maxHeight = 800,
  className = ""
}: VirtualizedImageGridProps & { maxHeight?: number }) {
  const [containerHeight, setContainerHeight] = useState(maxHeight);

  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 200; // Estimate header height
      const footerHeight = 100; // Estimate footer height
      const availableHeight = viewportHeight - headerHeight - footerHeight;
      
      setContainerHeight(Math.min(maxHeight, Math.max(400, availableHeight)));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, [maxHeight]);

  return (
    <div style={{ height: containerHeight }} className={className}>
      <VirtualizedImageGrid
        items={items}
        onImageClick={onImageClick}
        onImageLike={onImageLike}
        onImageDownload={onImageDownload}
        className="h-full"
      />
    </div>
  );
}

/**
 * Paginated virtual grid
 * Combines pagination and virtualization, suitable for large data sets
 */
export function PaginatedVirtualGrid({
  items,
  onImageClick,
  onImageLike,
  onImageDownload,
  itemsPerPage = 100,
  className = ""
}: VirtualizedImageGridProps & { itemsPerPage?: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={className}>
      <VirtualizedImageGrid
        items={currentItems}
        onImageClick={onImageClick}
        onImageLike={onImageLike}
        onImageDownload={onImageDownload}
      />
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-ghost btn-sm"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`btn btn-sm ${
                    currentPage === pageNum 
                      ? 'btn-primary' 
                      : 'btn-ghost'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-ghost btn-sm"
          >
            Next
          </button>
        </div>
      )}
      
      {/* Page information */}
      <div className="mt-4 text-center text-sm text-text-tertiary">
        Showing {startIndex + 1}-{Math.min(endIndex, items.length)} of {items.length} items
      </div>
    </div>
  );
}

/**
 * Lazy loading image grid
 * Only begins loading when images enter the viewport
 */
export function LazyImageGrid({
  items,
  onImageClick,
  onImageLike,
  onImageDownload,
  className = ""
}: VirtualizedImageGridProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id || `${item.timestamp}-${index}`}
          data-index={index}
          ref={(el) => {
            if (el && observerRef.current) {
              observerRef.current.observe(el);
            }
          }}
        >
          {visibleItems.has(index) ? (
            <ImageCard
              imageUrl={item.imageUrl}
              alt={item.name || 'Generated artwork'}
              index={index}
              priority={index < 16}
              onClick={() => onImageClick(item)}
              onLike={(liked) => onImageLike?.(item, liked)}
              onDownload={() => onImageDownload?.(item)}
            />
          ) : (
            <div className="aspect-square bg-surface-tertiary rounded-2xl animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}
