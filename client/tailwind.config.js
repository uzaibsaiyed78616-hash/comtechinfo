/** @type {import('tailwindcss').Config} */
export default {
  // Dark mode 'class' strategy  best 
  darkMode: "class", 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        // Emerald ki puri family (Light aur Dark dono modes ke liye)
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Custom dark shades jise tum 'bg-dark-bg' ya 'border-dark-border' 
        dark: {
          bg: '#0B1120',
          card: '#111827',
          border: '#1F2937',
          text: '#94A3B8'
        },
      },
      // Smooth animations for loaders or buttons
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}