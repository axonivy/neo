export default {
  defaultNamespace: 'translation',
  defaultValue: '__MISSING_TRANSLATION__',
  keepRemoved: false,
  locales: ['en', 'de', 'ja'],
  output: 'public/locales/$NAMESPACE/$LOCALE.json',
  pluralSeparator: '_',
  input: ['app/**/*.ts', 'app/**/*.tsx'],
  verbose: false
};
