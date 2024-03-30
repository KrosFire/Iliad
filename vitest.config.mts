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
      '~': new URL('./', import.meta.url).pathname,
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
})
