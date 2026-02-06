import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'schemas/**/*.ts',
        'lib/**/*.ts',
        'store/**/*.ts',
        'requests/**/*.ts',
        'hooks/**/*.{ts,tsx}',
        'enums/**/*.ts',
        'middleware.ts',
        'providers/**/*.tsx',
      ],
      exclude: [
        'lib/mock-data.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
