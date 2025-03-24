import { deCommonTranslation, deTranslation, enCommonTranslation, enTranslation } from '@axonivy/process-editor';
import i18n, { type Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const localTranslations: Resource = {
  'process-editor': {
    en: enTranslation,
    de: deTranslation
  },
  common: {
    en: enCommonTranslation,
    de: deCommonTranslation
  }
};

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(resourcesToBackend((lng: string, ns: string) => localTranslations[ns][lng]))
    .use(LanguageDetector)
    .init({
      debug: true,
      supportedLngs: ['en', 'de'],
      fallbackLng: 'en',
      ns: ['process-editor'],
      defaultNS: 'process-editor',
      resources: {
        en: { 'process-editor': enTranslation, common: enCommonTranslation },
        de: { 'process-editor': deTranslation, common: deCommonTranslation }
      }
    });
};
