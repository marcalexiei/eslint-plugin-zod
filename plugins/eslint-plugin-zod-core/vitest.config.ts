import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    conditions: ['@eslint-zod/source'],
  },
  ssr: {
    resolve: {
      conditions: ['@eslint-zod/source'],
    },
  },
  test: {
    setupFiles: ['./tests/setup.ts'],
  },
});
