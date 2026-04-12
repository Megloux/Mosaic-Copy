/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': {
          500: '#0ea5e9',
        },

        /* --- Semantic color system (dark theme) --- */

        // Backgrounds
        background: 'rgb(0, 0, 0)',
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          hover: 'rgba(255, 255, 255, 0.1)',
          raised: 'rgba(255, 255, 255, 0.08)',
          overlay: 'rgba(255, 255, 255, 0.12)',
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          foreground: 'rgb(255, 255, 255)',
        },
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          foreground: 'rgba(255, 255, 255, 0.5)',
        },
        secondary: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          foreground: 'rgba(255, 255, 255, 0.7)',
        },
        accent: {
          DEFAULT: 'rgba(0, 183, 120, 0.15)',
          foreground: 'rgb(255, 255, 255)',
        },
        destructive: {
          DEFAULT: 'rgb(239, 68, 68)',
          foreground: 'rgb(255, 255, 255)',
        },

        // Text
        foreground: 'rgb(255, 255, 255)',

        // Borders
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.2)',
        },

        // Focus ring
        ring: 'rgb(0, 183, 120)',

        // Primary (existing, preserved)
        primary: {
          DEFAULT: 'rgb(0 183 120)',
          foreground: 'rgb(255 255 255)',
        },
        'primary-foreground': 'rgb(255 255 255)',
      },
    },
  },
  plugins: [],
}
