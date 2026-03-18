import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { noUnknownAction } from '~/utils/no-unknown';
import type { CaseMapActionHandler } from './casemap-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<CaseMapActionHandler>(
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
