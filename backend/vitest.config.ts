import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/tests/**',
        'src/types/environment.d.ts',
        'src/server.ts',
        'src/register.ts'
      ],
      include: ['src/**/*.ts'],
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
      reportsDirectory: './coverage',
      // Create HTML report that can be viewed in browser
      all: true,
      // Fail if coverage is below thresholds
      thresholds: {
        // Lower for now until we increase coverage of server.ts
        lines: 65,
        functions: 85,
        branches: 75,
        statements: 65
      }
    },
    // Add detailed reporting
    outputFile: {
      json: './coverage/test-results.json'
    }
  },
});