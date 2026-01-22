/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'apps/**', 'contracts/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/meme-board-main.tsx', 'src/App.tsx'],
      reporter: ['text', 'html'],
    },
  },
})
