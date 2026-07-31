/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0B0C',
          darkCard: '#141416',
          beige: '#F5F2EB',
          beigeLight: '#FAF8F5',
          gold: '#D4AF37',
          goldHover: '#C5A059',
          bronze: '#8C6D2D',
          bronzeDark: '#6A511F',
          bronzeLight: '#B5944B',
          accent: '#A47E3B',
          border: 'rgba(212, 175, 55, 0.15)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #8C6D2D 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #E5BF47 0%, #9C7D3D 100%)',
        'dark-glass': 'linear-gradient(180deg, rgba(20, 20, 22, 0.75) 0%, rgba(14, 14, 16, 0.85) 100%)',
        'light-glass': 'linear-gradient(180deg, rgba(245, 242, 235, 0.85) 0%, rgba(250, 248, 245, 0.95) 100%)',
        'card-glow': 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(212, 175, 55, 0.08), transparent 40%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
