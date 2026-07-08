/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#f5f0e4',
        foreground: '#1f2937',
        primary: {
          DEFAULT: '#11676a',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#dda63a',
          foreground: '#1f2937',
        },
        destructive: {
          DEFAULT: '#c2382e',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        border: '#e5e7eb',
        input: '#e5e7eb',
        ring: '#11676a',
      },
    },
  },
};
