/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

console.log('aliases', {
  '@': path.resolve(__dirname, './src'),
  '~': path.resolve(__dirname, './'),
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    },
    coverage: {
      provider: 'istanbul',
      exclude: ['**/node_modules/**', '**/dist/**', 'src/plugins/**', 'src-tauri/**'],
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
})
