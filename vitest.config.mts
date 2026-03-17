import react from '@vitejs/plugin-react';
import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    globals: true,
    exclude: [...defaultExclude, '**/e2e/**'],
    alias: {
      '@': new URL('.', import.meta.url).pathname,
    },
  },
});
