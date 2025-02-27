import { useCallback } from 'react';
import type { CmsActionHandler } from './cms-client';

export const useActionHandler = () => {
  return useCallback<CmsActionHandler>(action => {
    if (action.actionId === 'openUrl') {
      window.open(action.payload);
      return;
    }
  }, []);
};
