import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import type { UserActionHandler } from './user-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<UserActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
    },
    [openUrl]
  );
};
