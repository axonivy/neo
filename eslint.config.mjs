import config from '@axonivy/eslint-config';
import a11y from 'eslint-plugin-jsx-a11y';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  ...config.base,
  // TypeScript configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  // JSX a11y configs
  a11y.flatConfigs.recommended,
  // Project specific configs
  {
    name: 'ignore-files',
    ignores: ['public/**', 'dist/**', '**/generated/*-client.ts', '.react-router/**', 'playwright/global.teardown.ts']
  },
  {
    name: 'neo/rules',
    rules: {
      '@tanstack/query/exhaustive-deps': 'off'
    }
  }
);
