import { enTranslation } from '@axonivy/process-editor';
import i18n, { type Resource } from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const localTranslations: Resource = {
  'process-editor': {
    en: enTranslation
  }
};

export const initTranslation = async () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .use(LngDetector)
    .init({
      debug: true,
      fallbackLng: 'en',
      ns: ['process-editor'],
      defaultNS: 'process-editor',
      load: 'languageOnly',
      partialBundledLanguages: true,
      backend: {
        backends: [HttpBackend, resourcesToBackend((lng: string, ns: string) => localTranslations[ns][lng])],
        backendOptions: [
          {
            loadPath: (lngs: Array<string>, nss: Array<string>) => `/neo/assets/locales/${lngs[0]}/${nss[0]}.json`
          }
        ]
      }
    });
};
