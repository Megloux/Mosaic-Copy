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
