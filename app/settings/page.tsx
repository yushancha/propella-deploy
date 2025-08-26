"use client";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useTheme } from "../../contexts/ThemeContext";
import { t } from "../../lib/i18n";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [quality, setQuality] = useState('high');
  const [activeTab, setActiveTab] = useState('general');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!session) redirect('/');

  const menuItems = [
    { id: 'general', label: t('settings.general.title'), icon: '⚙️' },
    { id: 'appearance', label: t('settings.appearance.title'), icon: '🎨' },
    { id: 'generation', label: t('settings.generation.title'), icon: '⚡' },
    { id: 'account', label: t('settings.account.title'), icon: '👤' },
  ];

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.title')}</h1>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Menu */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3 text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('settings.general.title')}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.account.notifications')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.account.notificationsDescription')}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.account.autosave')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.account.autosaveDescription')}</p>
                    </div>
                    <button
                      onClick={() => setAutoSave(!autoSave)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoSave ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('settings.appearance.title')}</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('settings.appearance.theme')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="w-full h-12 bg-white rounded border mb-2"></div>
                      <span className="text-sm text-gray-900 dark:text-white">{t('settings.appearance.light')}</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="w-full h-12 bg-gray-800 rounded border mb-2"></div>
                      <span className="text-sm text-gray-900 dark:text-white">{t('settings.appearance.dark')}</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        theme === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="w-full h-12 bg-gradient-to-r from-white to-gray-800 rounded border mb-2"></div>
                      <span className="text-sm text-gray-900 dark:text-white">{t('settings.appearance.system')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generation Settings */}
            {activeTab === 'generation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('settings.generation.title')}</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.generation.defaultQuality')}</label>
                  <select 
                    value={quality}
                    onChange={e => setQuality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="standard">{t('settings.generation.standard')}</option>
                    <option value="high">{t('settings.generation.high')}</option>
                    <option value="ultra">{t('settings.generation.ultra')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('settings.account.title')}</h2>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img src={session.user?.image || ''} alt="Avatar" className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{session.user?.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{session.user?.email}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full mt-1">
                      Free User
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






