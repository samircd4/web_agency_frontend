/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald-500
          dark: '#059669',
          light: '#34d399',
        },
        brand: {
          blue: '#1d4ed8', // Deep Brand Blue (Indigo/Blue-700)
          red: '#dc2626',  // Professional Red (Red-600)
        },
      },
    },
  },
  plugins: [],
};