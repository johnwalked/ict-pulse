/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0a0e17', secondary: '#111827', tertiary: '#1f2937' },
        accent: { cyan: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a855f7' }
      }
    },
  },
  plugins: [],
}
