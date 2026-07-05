/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#11676a',
        secondary: '#dda63a',
        background: '#e4dcca',
        destructive: '#c2382e',
      },
    },
  },
  plugins: [],
};
