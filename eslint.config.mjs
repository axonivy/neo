import config from '@axonivy/eslint-config';
import i18next from 'eslint-plugin-i18next';
import a11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import customRules from './eslint-plugin-custom-rules.js';

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
    ignores: [
      '**/generated/openapi-*.ts',
      '.react-router/**',
      'playwright/global.teardown.ts',
      'eslint-plugin-custom-rules.js',
      'i18next-parser.config.js'
    ]
  },
  {
    name: 'neo/rules',
    plugins: {
      i18next,
      custom: customRules
    },
    rules: {
      '@tanstack/query/exhaustive-deps': 'off',
      'custom/no-hardcoded-jsx-strings': 'warn',
      'i18next/no-literal-string': [
        'warn',
        {
          markupOnly: false,
          framework: 'react',
          mode: 'jsx-only',
          'should-validate-template': true,
          'jsx-attributes': { include: ['title', 'aria-label', 'label', 'tag-label', 'info', 'description'] }
        }
      ]
    }
  }
);
