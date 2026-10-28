/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hotel: {
          navy: '#0b132b',
          midnight: '#1c2541',
          slate: '#3a506b',
          gold: '#cda043',
          'gold-hover': '#b58832',
          sand: '#f8f5ee',
          cream: '#fdfbf7',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
