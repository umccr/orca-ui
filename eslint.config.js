import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierOptions from './prettier.config.js'; // Import Prettier configuration

export default [
  {
    ignores: ['dist/**/*'],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },

  // eslint-plugin-react-hooks
  {
    plugins: {
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },

  // eslint-react-refresh
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
  },

  // eslint-plugin-prettier
  {
    plugins: {
      prettier: {
        ...eslintPluginPrettier,
        extends: ['plugin:prettier/recommended'],
        rules: {
          'prettier/prettier': ['error', prettierOptions],
        },
      },
    },
  },
];
