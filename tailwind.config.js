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
        // Modern theme system - using CSS variables
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

        // Status colors
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
        'info': 'var(--info)',

        // Primary color system (here we changed 500 to #2d2e30)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2d2e30',          // ← Changed here
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // Compatibility aliases
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
      animation: { /* Omitted, same as your original file */ },
      keyframes: { /* Omitted, same as your original file */ },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.15)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: { /* Omitted, same as your original file */ },
    },
  },
  plugins: [
    // If Tailwind ≥3.3, you can delete the line below as it's built-in
    // require('@tailwindcss/line-clamp'),
  ],
};