/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pattern': "url('/public/banner-bg.png')",
        'form': "url('/public/formBg.jpg')",
      },
      margin: {
        'print-20mm': '20mm', // Add a custom margin size for print
      },
      screens: {
        'tall': { 'raw': '(min-height: 1336px)' },
        'fold': { 'raw': '(max-width: 300px)' },
        'print': {'raw': 'print'},
      }
    },
    plugins: [],
  }
}