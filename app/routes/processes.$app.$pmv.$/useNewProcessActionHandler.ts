import { useCallback } from 'react';
import { InscriptionActionArgs } from '@axonivy/inscription-protocol';

export const isActionWithId = (obj: unknown, actionId: string): obj is { method: string; params: InscriptionActionArgs } => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'action' &&
    'params' in obj &&
    typeof obj.params === 'object' &&
    obj.params !== null &&
    'actionId' in obj.params &&
    obj.params.actionId === actionId
  );
};

export const useNewProcessActionHandler = () => {
  return useCallback((data: unknown) => {
    if (!isActionWithId(data, 'newProcess')) {
      return;
    }
    console.log(data);
  }, []);
};
