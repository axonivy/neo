import i18n, { type Resource } from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import deTranslationNeo from './neo/de.json';
import enTranslationNeo from './neo/en.json';

import { deTranslation as deTranslationCms, enTranslation as enTranslationCms } from '@axonivy/cms-editor';
import { deTranslation as deTranslationDataClass, enTranslation as enTranslationDataClass } from '@axonivy/dataclass-editor';
import { deMessages as deTranslationForm, enMessages as enTranslationForm } from '@axonivy/form-editor';
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
  'cms-editor': {
    en: enTranslationCms,
    de: deTranslationCms
  },
  'variable-editor': {
    en: enTranslationVariable,
    de: deTranslationVariable
  },
  'form-editor': {
    en: enTranslationForm,
    de: deTranslationForm
  }
};

export const initTranslation = async (debug = false) => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  await i18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .use(LngDetector)
    .init({
      debug,
      fallbackLng: Object.keys(localTranslations['neo']),
      ns: Object.keys(localTranslations),
      defaultNS: 'neo',
      load: 'languageOnly',
      partialBundledLanguages: true,
      backend: {
        backends: [HttpBackend, resourcesToBackend((lng: string, ns: string) => localTranslations[ns][lng])],
        backendOptions: [
          {
            loadPath: (lngs: Array<string>, nss: Array<string>) => {
              if (loadLanguages().includes(lngs[0])) {
                return `/webjars/locales/${lngs[0]}/${nss[0]}.json`;
              }
              return;
            }
          }
        ]
      }
    });
  i18n.loadLanguages(loadLanguages());
};

const loadLanguages = () => {
  const loadLngs = window.localStorage.getItem('i18nextLngLoad');
  if (!loadLngs) {
    return [];
  }
  try {
    const parsedLngs = JSON.parse(loadLngs);
    if (Array.isArray(parsedLngs)) {
      return parsedLngs;
    }
  } catch {
    console.log('Error parsing i18nextLngLoad');
  }
  return [];
};
