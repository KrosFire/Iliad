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
      '@': new URL('./src/', import.meta.url).pathname,
      '~': new URL('./', import.meta.url).pathname,
    },
    coverage: {
      provider: 'istanbul',
      exclude: ['**/node_modules/**', '**/dist/**', 'src/plugins/**', 'src-tauri/**'],
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
    },
    setupFiles: ['./src/tests/setup.ts'],
  },
  define: {
    __TAURI_METADATA__: {
      __currentWindow: {
        label: 'test/workspace',
      },
    },
  },
})
