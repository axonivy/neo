import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { noUnknownAction } from '~/utils/no-unknown-action';
import type { DatabaseActionHandler } from './database-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<DatabaseActionHandler>(
    action => {
      switch (action.actionId) {
        case 'openUrl':
          openUrl(action.payload);
          return;
        default:
          noUnknownAction(action.actionId);
      }
    },
    [openUrl]
  );
};
