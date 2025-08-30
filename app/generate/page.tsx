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
import { t } from '@/lib/i18n';

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

  // Auto-hide functionality state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Image detail modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GenerationRecord | null>(null);

  // Debounced search
  useDebounce(itemName, 300);

  // Handle URL parameters - support passing prompts and parameters from other pages
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

  // Scroll listener - auto-hide top input area
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollY = scrollContainerRef.current.scrollTop;
      const scrollThreshold = 100; // Scroll threshold
      
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // Scrolling down and past threshold - hide
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= scrollThreshold) {
        // Scrolling up or back to top - show
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

  // Load history records
  useEffect(() => {
    if (status === 'authenticated') {
      loadGenerations();
    }
  }, [status]);

  // Early return for rendering only, hooks must be called before return
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

      // Validate and clean data - ensure all records have valid image URLs
      const validRecords = records.filter(record => {
        const hasValidUrl = record.imageUrl &&
          (record.imageUrl.startsWith('http') || record.imageUrl.startsWith('data:'));

        if (!hasValidUrl) {
          console.warn('Found invalid image record:', record);
        }

        return hasValidUrl;
      });

      console.log(`Loaded ${validRecords.length} valid records, filtered ${records.length - validRecords.length} invalid records`);
      setGenerations(validRecords);

    } catch (error) {
      console.error('Failed to load history records:', error);
      setGenerations([]); // Set to empty array instead of keeping loading state
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const handleGenerate = async () => {
    if (!itemName.trim()) return;
    
    setIsGenerating(true);
    try {
      let imageUrl = '';
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: itemName, style, level })
        });
        const data = await response.json();
        console.log('API response data:', data);
        if (data?.success) {
          imageUrl = data.imageUrl || (data.data && data.data[0] && data.data[0].url) || data.url || '';
        }
      } catch (apiError) {
        console.warn('API generate-image failed, falling back to mock image.', apiError);
      }

      // Fallback to mock placeholder image if no valid URL from API
      if (!imageUrl || !(imageUrl.startsWith('http') || imageUrl.startsWith('data:') || imageUrl.startsWith('/'))) {
        imageUrl = '/pixel-sword.svg';
      }

      const newGeneration: GenerationRecord = {
        id: crypto.randomUUID(),
        name: itemName,
        style,
        level,
        imageUrl,
        timestamp: Date.now()
      };

      try {
        if (isIndexedDBSupported()) {
          await propellaDB.addGeneration({ name: itemName, style, level, imageUrl });
        } else {
          const currentHistory = JSON.parse(localStorage.getItem('history') || '[]');
          currentHistory.unshift(newGeneration);
          localStorage.setItem('history', JSON.stringify(currentHistory));
        }
      } catch (error) {
        console.error('Failed to save to database:', error);
      }

      setGenerations(prev => [newGeneration, ...prev]);
      setItemName('');
      setIsHeaderVisible(true);
      console.log('New generation record added:', newGeneration);
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick scroll to top
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle image card click - open detail modal
  const handleImageClick = (generation: GenerationRecord) => {
    setSelectedImage(generation);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Use prompt - copy from modal to input field
  const handleUsePrompt = (prompt: string) => {
    setItemName(prompt);
    setIsHeaderVisible(true); // Ensure header is visible
  };

  return (
    <PageLoadAnimation>
      <div className="flex flex-col h-screen bg-surface-primary relative">
      {/* Top toolbar - modern design */}
      <header
        id="prompt-controls"
        className={`sticky top-0 z-30 glass border-b border-border-primary transition-all duration-300 ease-in-out ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Page title area - minimal */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{t('createPage.title')}</h1>
            <p className="text-text-secondary text-sm sm:text-base">{t('createPage.subtitle')}</p>
          </div>

          {/* Prompt input area - centered, minimal */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Main input field */}
            <div className="relative group">
              <textarea
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={t('createPage.placeholder')}
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

            {/* Compact options under input */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="select select-sm"
                disabled={isGenerating}
                title="Art Style"
              >
                <option value="pixel">Pixel</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Sci‑Fi</option>
                <option value="cartoon">Cartoon</option>
              </select>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="select select-sm"
                disabled={isGenerating}
                title="Rarity"
              >
                <option value="normal">Normal</option>
                <option value="elite">Elite</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
              <PulseButton
                onClick={handleGenerate}
                disabled={isGenerating || !itemName.trim()}
                className="btn-sm"
                variant="primary"
              >
                {isGenerating ? 'Generating…' : t('createPage.generateButton')}
              </PulseButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area - modern grid layout */}
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
                  {/* Empty state icon */}
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl flex items-center justify-center border border-border-primary">
                      <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-3xl -z-10 animate-pulse"></div>
                  </div>

                  {/* Empty state text */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-text-primary">
                      Ready to create something amazing?
                    </h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                      Describe any game item you can imagine and watch AI bring it to life.
                      From legendary weapons to mystical artifacts.
                    </p>
                  </div>

                  {/* Example tags */}
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
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text-primary">Your Creations ({generations.length})</h2>
                <div className="space-y-3">
                  {generations.map((gen) => (
                    <div key={gen.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border-primary bg-surface-secondary/30">
                      <div className="w-full sm:w-48 md:w-56 flex-shrink-0">
                        <img src={gen.imageUrl} alt={gen.name || 'Generated'} className="w-full h-auto rounded-lg object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-lg font-semibold text-text-primary mb-1">{gen.name}</div>
                          <div className="text-sm text-text-secondary">Style: {gen.style} · Rarity: {gen.level}</div>
                          <div className="text-xs text-text-tertiary mt-1">{new Date(gen.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => handleImageClick(gen)} className="btn btn-secondary btn-sm">View</button>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = gen.imageUrl;
                              link.download = `${gen.name || 'image'}-${gen.style}-${gen.level}.png`;
                              link.click();
                            }}
                            className="btn btn-ghost btn-sm"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating action buttons - responsive design */}
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

      {/* Image detail modal */}
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

// Old components have been replaced by new ImageCard components




