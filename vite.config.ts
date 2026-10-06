/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep the course content, syntax highlighter and React in separate,
        // long-cacheable chunks so the app shell stays small.
        manualChunks(id) {
          if (id.includes('/src/content/')) return 'content'
          if (id.includes('node_modules/highlight.js')) return 'highlight'
          if (id.includes('node_modules')) return 'vendor'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
