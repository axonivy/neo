import { useCallback } from 'react';
import { useOpenUrl } from '../useOpenUrl';
import type { VariableActionHandler } from './variable-client';

export const useActionHandler = () => {
  const openUrl = useOpenUrl();
  return useCallback<VariableActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
    },
    [openUrl]
  );
};
