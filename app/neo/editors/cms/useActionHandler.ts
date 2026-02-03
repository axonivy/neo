import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { noUnknownAction } from '~/utils/no-unknown';
import type { CmsActionHandler } from './cms-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<CmsActionHandler>(
    action => {
      const actionId = action.actionId;
      switch (actionId) {
        case 'openUrl':
        case 'openFile':
          openUrl(action.url);
          break;
        default:
          noUnknownAction(actionId);
      }
    },
    [openUrl]
  );
};
