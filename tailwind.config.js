/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 现代化主题系统 - 使用CSS变量
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-modal': 'var(--bg-modal)',

        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',

        'border-primary': 'var(--border-primary)',
        'border-secondary': 'var(--border-secondary)',
        'border-hover': 'var(--border-hover)',

        'accent-primary': 'var(--accent-primary)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',

        // 状态颜色
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
        'info': 'var(--info)',

        // 主色调系统（这里把 500 改成 #2d2e30）
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2d2e30',          // ← 这里改掉了
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // 兼容别名
        'surface-primary': 'var(--bg-primary)',
        'surface-secondary': 'var(--bg-secondary)',
        'surface-tertiary': 'var(--bg-tertiary)',
        'surface-modal': 'var(--bg-modal)',
        'text-high': 'var(--text-primary)',
        'text-medium': 'var(--text-secondary)',
        'text-disabled': 'var(--text-tertiary)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: { /* 省略，同你原文件 */ },
      keyframes: { /* 省略，同你原文件 */ },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.15)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: { /* 省略，同你原文件 */ },
    },
  },
  plugins: [
    // 如果 Tailwind ≥3.3，可删除下面这行，因为已内置
    // require('@tailwindcss/line-clamp'),
  ],
};