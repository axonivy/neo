import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ['tsconfig.json'] })],
  test: {
    include: ['**/*.test.ts?(x)'],
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['vitest/setup-vitest.ts'],
    css: false,
    reporters: process.env.CI ? ['basic', 'junit'] : ['default'],
    outputFile: 'report.xml',
    sequence: { hooks: 'parallel' }
  }
});
