/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@/': '/src/',
      '~/': `/`,
    },
    coverage: {
      provider: 'istanbul',
      exclude: ['**/node_modules/**', '**/dist/**', 'src/plugins/**', 'src-tauri/**'],
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
})
