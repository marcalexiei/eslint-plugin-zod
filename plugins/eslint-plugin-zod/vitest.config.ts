import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['dist/**', 'node_modules/**'],
    setupFiles: ['./tests/setup.ts'],
    typecheck: {
      enabled: true,
      include: ['src/**/*.spec.ts'],
    },
  },
});
