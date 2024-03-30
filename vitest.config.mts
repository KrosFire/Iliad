/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

console.log('siema')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': new URL('./src', import.meta.url).pathname,
      '~/': new URL('./', import.meta.url).pathname,
    },
  },
  plugins: [
    vue(),
    tsconfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})