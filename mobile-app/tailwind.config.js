/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,tsx,ts,jsx}',
    './src/components/**/*.{js,tsx,ts,jsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
        },
        surface: '#ffffff',
        error: {
          DEFAULT: '#ef4444',
          bg: '#fef2f2',
          border: '#fecaca',
        },
        text: {
          primary: '#111827',
          muted: '#6b7280',
        },
      },
    },
  },
  plugins: [],
};
