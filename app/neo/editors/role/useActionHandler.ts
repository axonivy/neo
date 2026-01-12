import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import type { RoleActionHandler } from './role-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<RoleActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
    },
    [openUrl]
  );
};
