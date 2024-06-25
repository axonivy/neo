import { useCallback } from 'react';
import { InscriptionActionArgs } from '@axonivy/inscription-protocol';
import { useNewArtifactDialog } from '~/neo/dialog/useNewArtifactDialog';
import { useCreateProcess } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';

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
  const { createProcess } = useCreateProcess();
  const { open } = useNewArtifactDialog();
  return useCallback(
    (data: unknown) => {
      if (!isActionWithId(data, 'newProcess')) {
        return;
      }
      const project = { app: data.params.context.app, pmv: data.params.context.pmv };
      const pid = data.params.context.pid;
      open({
        create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
          createProcess({ name, namespace, kind: '', project, pid }),
        defaultName: 'NewCallable',
        title: 'Create new Process',
        project,
        pid
      });
    },
    [createProcess, open]
  );
};
