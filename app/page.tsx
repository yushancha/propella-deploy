"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { t } from '../lib/i18n';

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
                <Link href="/generate" className="text-foreground hover:text-hover dark:text-foreground-dark dark:hover:text-hover-dark">{t('navigation.create')}</Link>
                <img src={session.user?.image || ''} alt="Avatar" className="w-8 h-8 rounded-full" />
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-primary text-foreground-dark px-4 py-2 rounded-lg hover:bg-hover dark:bg-primary dark:text-foreground-dark dark:hover:bg-hover-dark transition-colors"
              >
                {t('auth.signIn')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Add top spacing to avoid content being hidden by fixed navigation bar */}
      <div className="pt-16">
        <div className="relative overflow-hidden bg-black">
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-[140%] h-[140%] -left-1/5 -top-1/5 absolute bg-[radial-gradient(circle_at_30%_20%,rgba(0,128,255,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(138,43,226,0.25),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(0,255,200,0.15),transparent_40%)] animate-pulse"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              Generate Epic Game Items with AI Magic
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Create pixel-perfect swords, potions, armor and artifacts in seconds. Fuel your game with mesmerizing assets.
            </p>
            <div className="mb-16">
              <Link
                href="/generate"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl shadow-blue-700/30"
              >
                Start Creating →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 opacity-90">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/50 text-sm">Item {i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










