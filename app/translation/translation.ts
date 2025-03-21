import i18n, { type Resource } from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import deTranslationNeo from './neo/de.json';
import enTranslationNeo from './neo/en.json';

import { deTranslation as deTranslationCms, enTranslation as enTranslationCms } from '@axonivy/cms-editor';
import { deTranslation as deTranslationDataClass, enTranslation as enTranslationDataClass } from '@axonivy/dataclass-editor';
import { deTranslation as deTranslationVariable, enTranslation as enTranslationVariable } from '@axonivy/variable-editor';
import { getCommonTranslations } from './commonTranslation';

const commonTranslations = getCommonTranslations();

const localTranslations: Resource = {
  neo: {
    en: enTranslationNeo,
    de: deTranslationNeo
  },
  'dataclass-editor': {
    en: enTranslationDataClass,
    de: deTranslationDataClass
  },
  'cms-editor': {
    en: enTranslationCms,
    de: deTranslationCms
  },
  'variable-editor': {
    en: enTranslationVariable,
    de: deTranslationVariable
  },
  common: commonTranslations
};

export const initTranslation = async () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  await i18n
    .use(resourcesToBackend((lng: string, ns: string) => localTranslations[ns][lng]))
    .use(initReactI18next)
    .use(LngDetector)
    .init({
      debug: true,
      fallbackLng: Object.keys(localTranslations['common']),
      ns: Object.keys(localTranslations),
      defaultNS: 'neo'
    });
};
