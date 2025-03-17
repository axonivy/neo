import config from '@axonivy/eslint-config';
import a11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
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
    ignores: ['**/generated/*-client.ts', '.react-router/**', 'playwright/global.teardown.ts']
  },
  {
    name: 'neo/rules',
    rules: {
      '@tanstack/query/exhaustive-deps': 'off'
    }
  }
);
