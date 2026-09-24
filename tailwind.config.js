/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#F7F8FA',
        surface: '#FFFFFF',
        ink: {
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          400: '#94A3B8',
          200: '#E2E8F0',
          100: '#EEF1F5',
        },
        navy: {
          950: '#0B1220',
          900: '#101A2E',
          800: '#16233D',
          700: '#1E2E4D',
        },
        accent: {
          DEFAULT: '#2451CC',
          600: '#2451CC',
          500: '#3B63D9',
          100: '#E7ECFB',
        },
        positive: {
          DEFAULT: '#0E8A5F',
          100: '#E3F5EC',
        },
        negative: {
          DEFAULT: '#C7351F',
          100: '#FBEAE7',
        },
        caution: {
          DEFAULT: '#B4720B',
          100: '#FBF0DD',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
