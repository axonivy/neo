import i18n from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

export const initTranslation = (defaultlocale: string) => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .init({
      debug: true,
      fallbackLng: defaultlocale,
      ns: ['neo'],
      defaultNS: 'neo',
      lng: defaultlocale,
      backend: {
        backends: [resourcesToBackend((lng: string, ns: string) => import(`./${ns}/${lng}.json`))],
        backendOptions: []
      }
    });
};

export const getAvailableLanguages = async () => {
  const loc = 'http://localhost:5173/neo/locales/available.json';
  const x = await fetch(loc);
  const a = await x.json();
  return ['en'].concat(a['languages']);
};
