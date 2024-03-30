/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': new URL('../', import.meta.url).pathname,
      '~/': new URL('../../', import.meta.url).pathname,
    },
  },
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
