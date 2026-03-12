/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        casino: {
          gold: '#FFD700',
          purple: '#6B21A8',
          dark: '#0F0A1A',
          neon: '#FF00FF',
          blue: '#1e3a5f',
        },
        pixel: {
          green: '#00ff00',
          red: '#ff0000',
        }
      },
      imageRendering: {
        pixelated: 'pixelated',
      }
    },
  },
  plugins: [],
}
