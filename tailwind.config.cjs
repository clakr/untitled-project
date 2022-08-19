/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          mantine6: '#228BE6',
          mantine7: '#1C7ED6'
        }
      }
    },
    fontFamily: {
      sans: 'Poppins'
    },
    screens: {
      xs: '450px',
      ...defaultTheme.screens
    }
  },
  plugins: []
}
