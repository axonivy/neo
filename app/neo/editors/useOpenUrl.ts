import { useCallback } from 'react';
import { useWebBrowser } from '../browser/useWebBrowser';

export const useOpenUrl = () => {
  const { browser } = useWebBrowser();
  return useCallback(
    (url: string) => {
      if (url.includes('dev-workflow-ui')) {
        const devWfUiUrl = new URL(url);
        browser.open(`${devWfUiUrl.pathname}${devWfUiUrl.search}`);
      } else {
        window.open(url);
      }
    },
    [browser]
  );
};
