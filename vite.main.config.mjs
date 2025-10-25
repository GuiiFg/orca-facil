import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [tailwindcss(), commonjs({
    ignoreDynamicRequires: true
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['better-sqlite3'],
    },
  },
});
