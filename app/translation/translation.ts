import i18n from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';

export const initTranslation = (defaultlocale: string) => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(ChainedBackend)

    .use(initReactI18next)
    .init({
      debug: true,
      fallbackLng: defaultlocale,
      ns: ['translation', 'overview'],
      defaultNS: 'translation',
      lng: defaultlocale,
      backend: {
        backends: [Backend, Backend],
        backendOptions: [
          {
            loadPath: './locales/{{ns}}/{{lng}}.json'
          },
          {
            loadPath: './locales/{{ns}}/{{lng}}.json'
          }
        ]
      }
    });
};

export const getAvailableLanguages = async () => {
  const loc = 'http://localhost:5173/neo/locales/available.json';
  const x = await fetch(loc);
  const a = await x.json();
  return ['en'].concat(a['languages']);
};
