import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['reflect-metadata'],
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80, functions: 80, branches: 80 },
      exclude: [
        '**/*.module.ts',
        '**/main.ts',
        '**/*.orm-entity.ts',
        '**/*.port.ts',
        '**/claude.config.ts',
        '**/vitest.config.ts',
      ],
    },
  },
})
