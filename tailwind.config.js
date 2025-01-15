/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn': {
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
          transition: 'background-color 0.3s',
        },
        '.btn-primary': {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#2563eb',
          },
        },
        '.btn-secondary': {
          backgroundColor: '#6b7280',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#4b5563',
          },
        },
        '.btn-danger': {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#dc2626',
          },
        },
      });
    },
  ],
};

