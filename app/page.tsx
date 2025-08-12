"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark">
      {/* Navigation with auto-hide */}
      <nav className={`border-b border-gray-200 bg-background/80 dark:bg-background-dark/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-semibold text-primary">PropGen.AI</div>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/generate" className="text-foreground hover:text-hover dark:text-foreground-dark dark:hover:text-hover-dark">Generate</Link>
                <Link href="/history" className="text-foreground hover:text-hover dark:text-foreground-dark dark:hover:text-hover-dark">History</Link>
                <Link href="/settings" className="text-foreground hover:text-hover dark:text-foreground-dark dark:hover:text-hover-dark">Settings</Link>
                <img src={session.user?.image || ''} alt="Avatar" className="w-8 h-8 rounded-full" />
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-primary text-foreground-dark px-4 py-2 rounded-lg hover:bg-hover dark:bg-primary dark:text-foreground-dark dark:hover:bg-hover-dark transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 添加顶部间距以避免内容被固定导航栏遮挡 */}
      <div className="pt-16">
        {/* 其余页面内容保持不变 */}
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-hover bg-clip-text text-transparent">
              AI Game Props Generator
            </h1>
            <p className="text-xl text-foreground/80 dark:text-foreground-dark/80 mb-8 max-w-3xl mx-auto">
              Create stunning game assets with AI. From weapons to armor, generate professional-quality props in seconds.
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              {session ? (
                <Link 
                  href="/generate"
                  className="inline-flex items-center px-8 py-4 bg-primary text-foreground-dark rounded-xl font-medium hover:bg-hover dark:bg-primary dark:text-foreground-dark dark:hover:bg-hover-dark transition-colors shadow-lg"
                >
                  Start Creating →
                </Link>
              ) : (
                <Link
                  href="/generate"
                  className="inline-flex items-center px-8 py-4 bg-primary text-foreground-dark rounded-xl font-medium hover:bg-hover dark:bg-primary dark:text-foreground-dark dark:hover:bg-hover-dark transition-colors shadow-lg"
                >
                  Start Creating →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










