/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: [
      { find: /^@\/(.*)/, replacement: resolve(__dirname, 'src/$1') },
      { find: /^~\/(.*)/, replacement: resolve(__dirname, '$1') },
    ],
    coverage: {
      provider: 'istanbul',
      exclude: ['**/node_modules/**', '**/dist/**', 'src/plugins/**', 'src-tauri/**'],
    },
  },
})
