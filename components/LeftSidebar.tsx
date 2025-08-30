"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import SettingsModal from './SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../lib/i18n';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  badge?: number;
  isNew?: boolean;
  hasSubmenu?: boolean;
  submenu?: NavItem[];
  isSubmenuOpen?: boolean;
}

// Midjourney-style icon components - precise replication
const Icons = {
  Explore: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Create: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Personalize: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Organize: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
    </svg>
  ),
  Subscribe: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  Help: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Updates: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  LightMode: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  DarkMode: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  System: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  ChevronDown: ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Menu: ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Logout: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
    </svg>
  ),
};

export default function LeftSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Mobile click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('left-sidebar');
      const target = event.target as Node;

      if (window.innerWidth < 1024 && sidebar && !sidebar.contains(target)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Midjourney navigation structure - precise replication
  // Removed chat and tasks submenu as these features are deprecated

  const navItems: NavItem[] = [
    { id: 'explore', label: t('sidebar.explore'), icon: <Icons.Explore />, href: '/explore' },
    { id: 'create', label: t('sidebar.create'), icon: <Icons.Create />, href: '/generate' },
    { id: 'edit', label: t('sidebar.edit'), icon: <Icons.Edit />, href: '/edit' },
    // Personalize now duplicates Subscribe page
    { id: 'personalize', label: t('sidebar.personalize'), icon: <Icons.Personalize />, href: '/personalize' },
    { id: 'subscribe', label: t('sidebar.subscribe'), icon: <Icons.Subscribe />, href: '/subscribe' },
    {
      id: 'theme-toggle',
      label: theme === 'light' ? 'Dark Mode' : theme === 'dark' ? 'System' : 'Light Mode',
      icon: theme === 'light' ? <Icons.DarkMode /> : theme === 'dark' ? <Icons.System /> : <Icons.LightMode />,
      action: () => toggleTheme()
    },
  ];

  // Theme toggle functionality
  const toggleTheme = () => {
    // Cycle through themes: light -> dark -> system -> light
    const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleNavClick = (item: NavItem) => {
    if (item.action) {
      item.action();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-surface-secondary border border-border-primary rounded-xl text-text-secondary hover:text-text-primary transition-colors"
      >
        <Icons.Menu />
      </button>

      <nav
        id="left-sidebar"
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-primary z-40 transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-center justify-between p-4 border-b border-border-primary">
            <Link href="/" className="flex items-center gap-3 text-text-primary hover:text-white transition-colors group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-glow transition-all duration-300">
                  P
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg gradient-text">
                  Propella
                </span>
                <span className="text-xs text-text-tertiary">
                  AI Creator
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.href && (pathname === item.href ||
                  (item.href === '/generate' && pathname === '/') ||
                  (item.href === '/generate' && pathname.startsWith('/generate')));

                return (
                  <div key={item.id} className="relative">
                    {/* Main navigation item */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`nav-link flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                          isActive
                            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"></div>
                        )}

                        <span className={`flex-shrink-0 transition-all duration-200 ${
                          isActive ? 'text-primary-400' : 'group-hover:scale-110'
                        }`}>
                          {item.icon}
                        </span>

                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.label}</span>
                          <div className="flex items-center gap-2">
                            {item.isNew && (
                              <span className="px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full font-medium">
                                New
                              </span>
                            )}
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-error-500 text-white text-xs rounded-full font-medium">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item)}
                        className={`nav-link w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                          item.hasSubmenu && item.isSubmenuOpen
                            ? 'bg-surface-secondary text-text-primary'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                        }`}
                      >
                        <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          {item.icon}
                        </span>
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate text-left">{item.label}</span>
                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-error-500 text-white text-xs rounded-full font-medium">
                                {item.badge}
                              </span>
                            )}
                            {item.hasSubmenu && (
                              <Icons.ChevronDown className={`transition-transform duration-200 ${
                                item.isSubmenuOpen ? 'rotate-180' : ''
                              }`} />
                            )}
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Submenu */}
                    {item.hasSubmenu && item.submenu && item.isSubmenuOpen && (
                      <div className="mt-2 ml-6 space-y-1 border-l border-border-primary pl-4">
                        {item.submenu.map((subItem) => {
                          const isSubActive = subItem.href && pathname === subItem.href;

                          return (
                            <Link
                              key={subItem.id}
                              href={subItem.href || '#'}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                                isSubActive
                                  ? 'bg-primary-500/10 text-primary-400'
                                  : 'text-text-tertiary hover:text-text-primary hover:bg-surface-secondary'
                              }`}
                            >
                              <span className="flex-shrink-0 w-4 h-4">
                                {subItem.icon}
                              </span>
                              <span className="truncate">{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="px-4 pb-4 space-y-4">
            {/* Quick Actions */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-3">
                Quick Actions
              </div>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200 group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Project</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200 group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export All</span>
                </button>
              </div>
            </div>

            {/* User Profile */}
            {session && (
              <div className="border-t border-border-primary pt-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary/50 border border-border-primary hover:border-border-hover transition-all duration-200 group">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={session.user?.image || '/default-avatar.png'}
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="rounded-xl ring-2 ring-border-primary group-hover:ring-border-hover transition-all duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-surface-primary"></div>
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">
                      {session.user?.name || 'User'}
                    </div>
                    <div className="text-xs text-text-tertiary truncate">
                      {session.user?.email}
                    </div>
                  </div>

                  <button
                    className="p-2 rounded-lg hover:bg-surface-tertiary transition-all duration-200 text-text-tertiary hover:text-text-primary group/btn"
                    title="Sign out"
                    onClick={handleSignOut}
                  >
                    <Icons.Logout />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Settings modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}



