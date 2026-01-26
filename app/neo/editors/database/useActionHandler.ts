import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import type { DatabaseActionHandler } from './database-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<DatabaseActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
    },
    [openUrl]
  );
};
