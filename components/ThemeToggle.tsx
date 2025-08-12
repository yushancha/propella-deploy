"use client";
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * 主题切换组件
 * 提供直观的主题选择界面
 */
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // 主题选项
  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: 'Light theme'
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      description: 'Dark theme'
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Follow system preference'
    }
  ];

  const currentOption = themeOptions.find(option => option.value === theme) || themeOptions[0];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.theme-toggle')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative theme-toggle">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary border border-border-primary"
        title={`Current theme: ${currentOption.label}${theme === 'system' ? ` (${resolvedTheme})` : ''}`}
      >
        {currentOption.icon}
        <span className="hidden sm:inline">{currentOption.label}</span>
        {theme === 'system' && (
          <span className="hidden md:inline text-text-tertiary">
            ({resolvedTheme})
          </span>
        )}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-bg-modal border border-border-primary rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  theme === option.value
                    ? 'bg-accent-light text-accent-primary'
                    : 'text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                {option.icon}
                <div className="flex-1 text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-text-tertiary">{option.description}</div>
                </div>
                {theme === option.value && (
                  <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          {/* 当前解析的主题指示 */}
          {theme === 'system' && (
            <div className="border-t border-border-primary px-4 py-2 bg-bg-secondary">
              <div className="text-xs text-text-tertiary">
                System preference: <span className="font-medium text-text-secondary">{resolvedTheme}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 简化的主题切换按钮
 * 用于空间受限的场景
 */
export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light': return 'Switch to Dark';
      case 'dark': return 'Switch to System';
      case 'system': return 'Switch to Light';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-bg-secondary text-text-secondary hover:text-text-primary"
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
}

/**
 * 主题状态指示器
 * 显示当前主题状态，不提供切换功能
 */
export function ThemeIndicator() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 text-sm text-text-tertiary">
      <div className="w-2 h-2 rounded-full bg-accent-primary"></div>
      <span>
        Theme: {theme}
        {theme === 'system' && ` (${resolvedTheme})`}
      </span>
    </div>
  );
}
