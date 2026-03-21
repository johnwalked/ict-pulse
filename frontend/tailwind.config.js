/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0e17',
        'bg-secondary': '#111827',
        'bg-tertiary': '#1f2937',
        'border': '#374151',
        'text-primary': '#f9fafb',
        'text-secondary': '#9ca3af',
        'text-tertiary': '#6b7280',
        'accent-primary': '#3b82f6',
        'accent-secondary': '#8b5cf6',
        'bull': '#10b981',
        'bear': '#ef4444',
        'warning': '#f59e0b',
        'gold': '#fbbf24',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
