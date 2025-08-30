"use client";
export const dynamic = "force-dynamic";
import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import LanguageSelector from './LanguageSelector';
import SettingsModal from './SettingsModal';
import { t } from '../lib/i18n';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-navy-900 via-purple-900 to-indigo-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
            FreeAIToolsMax
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-blue-100 hover:text-white transition-colors">
              {t('navigation.home')}
            </Link>
            <Link href="/generate" className="text-blue-100 hover:text-white transition-colors">
              {t('navigation.create')}
            </Link>
            {session && (
              <Link href="/batch-generate" className="text-blue-100 hover:text-white transition-colors">
                Batch Generate
              </Link>
            )}
            <Link href="/pricing" className="text-blue-100 hover:text-white transition-colors">
              {t('navigation.subscribe')}
            </Link>
            
            {session ? (
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-left"
              >
                {t('auth.logout')}
              </button>
            ) : (
              <Link href="/login" className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-center">
                {t('auth.signIn')}
              </Link>
            )}
            {/* Language Selector */}
            <LanguageSelector onChange={(lang) => {
              console.log(`Language changed to: ${lang}`);
              // Here you can add global state update for language switching
            }} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-800 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-blue-100 hover:text-white transition-colors px-2 py-1">
                {t('navigation.home')}
              </Link>
              <Link href="/generate" className="text-blue-100 hover:text-white transition-colors px-2 py-1">
                {t('navigation.create')}
              </Link>
              {session && (
                <Link href="/batch-generate" className="text-blue-100 hover:text-white transition-colors px-2 py-1">
                  Batch Generate
                </Link>
              )}
              <Link href="/pricing" className="text-blue-100 hover:text-white transition-colors px-2 py-1">
                {t('navigation.subscribe')}
              </Link>
              
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {t('auth.logout')}
                </button>
              ) : (
                <Link href="/login" className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                  {t('auth.signIn')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
}
