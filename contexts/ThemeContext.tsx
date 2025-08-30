"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // 检测系统主题偏好
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  // 应用主题到DOM
  const applyTheme = (newTheme: ThemeType) => {
    const root = document.documentElement;
    const body = document.body;

    // 移除旧的主题类
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    let actualTheme: 'light' | 'dark';

    if (newTheme === 'system') {
      actualTheme = getSystemTheme();
    } else {
      actualTheme = newTheme;
    }

    // 应用新主题
    if (actualTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark'); // 保持Tailwind兼容性
      body.classList.add('dark-mode');
    } else {
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark-mode');
    }

    setResolvedTheme(actualTheme);
  };

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, applyTheme]);

  // 初始化主题
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as ThemeType) || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, [applyTheme]);

  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}