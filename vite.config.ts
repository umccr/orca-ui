import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true }), visualizer() as PluginOption],
  resolve: {
    alias: {
      './runtimeConfig$': './runtimeConfig.browser',
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'aws-amplify': ['aws-amplify'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
          igv: ['igv'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
