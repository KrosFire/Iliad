/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `/src/`,
      '~/': `/`,
    },
  },
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
