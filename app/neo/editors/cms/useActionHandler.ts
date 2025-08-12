import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import type { CmsActionHandler } from './cms-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<CmsActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
    },
    [openUrl]
  );
};
