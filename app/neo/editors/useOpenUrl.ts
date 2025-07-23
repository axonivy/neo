import { useCallback } from 'react';
import { useSidePanel } from '../workspace/useSidePanel';

export const useOpenUrl = () => {
  const { sidePanel } = useSidePanel();
  return useCallback(
    (url: string) => {
      if (url.includes('dev-workflow-ui')) {
        const devWfUiUrl = new URL(url);
        sidePanel.openUrl(`${devWfUiUrl.pathname}${devWfUiUrl.search}`);
      } else {
        window.open(url);
      }
    },
    [sidePanel]
  );
};
