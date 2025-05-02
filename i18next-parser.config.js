/** @type {import('i18next-parser').UserConfig} */
export default {
  defaultNamespace: 'neo',
  defaultValue: '__MISSING_TRANSLATION__',
  keepRemoved: false,
  locales: ['en', 'de'],
  output: 'app/translation/$NAMESPACE/$LOCALE.json',
  pluralSeparator: '_',
  input: ['app/**/*.ts', 'app/**/*.tsx'],
  verbose: false,
  sort: true,
  lineEnding: 'lf'
};
