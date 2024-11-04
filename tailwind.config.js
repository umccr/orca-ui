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
      fontSize: {
        '2xs': '0.625rem',
      },
      fontFamily: {
        sans: ['Inter, sans-serif', { fontFeatureSettings: '"cv11"' }],
        mono: ['Inter, monospace', { fontFeatureSettings: '"tnum"' }],
        code: ['Source Code Pro', 'monospace'],
      },
    },
  },
  plugins: [import('@tailwindcss/forms')],
};
