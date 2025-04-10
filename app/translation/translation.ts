import i18n, { type Resource } from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

import { enTranslation as translationCms } from '@axonivy/cms-editor';
import { enTranslation as translationDataClass } from '@axonivy/dataclass-editor';
import { enMessages as translationForm } from '@axonivy/form-editor';
import { enTranslation as translationVariable } from '@axonivy/variable-editor';
import enTranslationNeo from './neo/en.json';

const localTranslations: Resource = {
  neo: { en: enTranslationNeo },
  'dataclass-editor': { en: translationDataClass },
  'cms-editor': { en: translationCms },
  'variable-editor': { en: translationVariable },
  'form-editor': { en: translationForm }
};

const LOCALES_PATH = `${import.meta.env.BASE_URL ?? '/'}assets/locales`;

let knownLanguages: string[] = [];

const getKnownLanguages: Promise<Array<string>> = fetch(`${LOCALES_PATH}/meta.json`)
  .then(async response => {
    if (response.ok) {
      knownLanguages = await response.json();
      return knownLanguages;
    }
    return [];
  })
  .catch(() => {
    return [];
  });

export const initTranslation = (debug = false) => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .use(LngDetector)
    .init({
      debug,
      fallbackLng: 'en',
      ns: Object.keys(localTranslations),
      defaultNS: 'neo',
      load: 'languageOnly',
      partialBundledLanguages: true,
      backend: {
        backends: [HttpBackend, resourcesToBackend((lng: string, ns: string) => localTranslations[ns][lng])],
        backendOptions: [
          {
            loadPath: (lngs: Array<string>, nss: Array<string>) => {
              if (knownLanguages.includes(lngs[0])) {
                return `${LOCALES_PATH}/${lngs[0]}/${nss[0]}.json`;
              }
              return;
            }
          }
        ]
      }
    });
  getKnownLanguages.then(i18n.loadLanguages);
};
