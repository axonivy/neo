import i18n, { type Resource } from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import deCommonTranslation from './commonConsolidated/de.json';
import enCommonTranslation from './commonConsolidated/en.json';
import deTranslationNeo from './neo/de.json';
import enTranslationNeo from './neo/en.json';

import { deTranslation as deTranslationDataClass, enTranslation as enTranslationDataClass } from '@axonivy/dataclass-editor';
import { deTranslation as deTranslationVariable, enTranslation as enTranslationVariable } from '@axonivy/variable-editor';

const localTranslations: Resource = {
  neo: {
    en: enTranslationNeo,
    de: deTranslationNeo
  },
  'dataclass-editor': {
    en: enTranslationDataClass,
    de: deTranslationDataClass
  },
  'variable-editor': {
    en: enTranslationVariable,
    de: deTranslationVariable
  },
  common: {
    en: enCommonTranslation,
    de: deCommonTranslation
  }
};

export const initTranslation = (defaultlocale: string) => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .init({
      debug: true,
      fallbackLng: defaultlocale,
      ns: ['neo', 'dataclass-editor', 'variable-editor', 'common'],
      defaultNS: 'neo',
      lng: defaultlocale,
      backend: {
        backends: [resourcesToBackend((lng: string, ns: string) => localTranslations[ns][lng])],
        backendOptions: []
      }
    });
};
