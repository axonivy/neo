import { useCallback } from 'react';
import type { VariableActionHandler } from './variable-client';

export const useActionHandler = () => {
  return useCallback<VariableActionHandler>(action => {
    if (action.actionId === 'openUrl') {
      window.open(action.payload);
      return;
    }
  }, []);
};
