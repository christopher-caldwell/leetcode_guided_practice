import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: [
      'tests/**/*.test.ts',
      'src/**/*.test.ts',
      'lessons/**/*.test.ts',
      '.workshop/**/*.test.ts',
    ],
    testTimeout: 10_000,
    hookTimeout: 10_000,
    sequence: { concurrent: false },
  },
})
