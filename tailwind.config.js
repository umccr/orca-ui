/** @type {import('tailwindcss').Config} */

import colorPalette from './src/utils/colorPalette';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: colorPalette,
      // box shadow
      boxShadow: {
        'inner-lg': '0 4px 30px rgba(0, 0, 0, 0.8)',
      },
      flex: {
        2: '2 2 0%',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
