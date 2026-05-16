import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
      },
      exclude: [
        'src/**/*.stories.tsx',
        'src/test-setup.ts',
        'src/app/styles/**',
        'src/**/index.ts',
        'src/main.tsx',
        'src/app/App.tsx',
      ],
    },
  },
})
