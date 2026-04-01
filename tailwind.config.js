/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 20px 35px -24px rgba(15, 23, 42, 0.45)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
          '50%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0.12)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 0.75s ease-out 1',
      },
    },
  },
  plugins: [],
};
