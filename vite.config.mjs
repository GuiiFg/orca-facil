import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

/**
 * Standalone Vite config for web/Capacitor builds (not Electron).
 * Usage: npx vite build --config vite.config.mjs
 */
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
