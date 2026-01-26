import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { noUnknownAction } from '~/utils/no-unknown-action';
import type { CmsActionHandler } from './cms-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<CmsActionHandler>(
    action => {
      switch (action.actionId) {
        case 'openUrl':
          openUrl(action.payload);
          return;
        default:
          noUnknownAction(action.actionId);
      }
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
    },
    [openUrl]
  );
};
