import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    'storybook-addon-remix-react-router',
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
  ],

  framework: {
    name: '@storybook/react',
    options: {},
  },

  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
    });
  },
};

export default config;
