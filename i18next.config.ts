import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'de'],
  extract: {
    input: ['app/**/*.ts', 'app/**/*.tsx'],
    output: 'app/translation/{{namespace}}/{{language}}.json',
    defaultNS: 'neo',
    functions: ['t', '*.t'],
    transComponents: ['Trans'],
    defaultValue: '__MISSING_TRANSLATION__'
  },
  types: {
    input: ['locales/{{language}}/{{namespace}}.json'],
    output: 'app/types/i18next.d.ts'
  }
});
