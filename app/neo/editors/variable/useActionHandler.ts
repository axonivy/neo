import { useCallback } from 'react';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { noUnknownAction } from '~/utils/no-unknown-action';
import type { VariableActionHandler } from './variable-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<VariableActionHandler>(
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
