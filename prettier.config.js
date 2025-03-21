/**
 * @see https://prettier.io/docs/en/configuration.html
 */

export default {
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  printWidth: 100,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  endOfLine: 'lf',

  // tailwindcss
  plugins: ['prettier-plugin-tailwindcss'],
};
