import { useCallback } from 'react';
import { InscriptionActionArgs } from '@axonivy/inscription-protocol';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateProcess } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { useCreateForm } from '~/data/form-api';

const isActionWithId = (
  obj: unknown,
  actionId: InscriptionActionArgs['actionId']
): obj is { method: string; params: InscriptionActionArgs } => {
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

// const sendInscriptionNotification = (window: WindowProxy | null, type: keyof InscriptionNotificationTypes) => {
//   window?.postMessage({ method: type });
// };

// const createAndNotifyInscription = (create: () => string | number, window: WindowProxy | null) => {
//   const result = create();
//   sendInscriptionNotification(window, 'dataChanged');
//   sendInscriptionNotification(window, 'validation');
//   return result;
// };

export const useNewProcessActionHandler = () => {
  const { createProcess } = useCreateProcess();
  const open = useNewArtifact();
  return useCallback(
    (data: unknown, frame: WindowProxy | null) => {
      if (!isActionWithId(data, 'newProcess')) {
        return;
      }
      const project = { app: data.params.context.app, pmv: data.params.context.pmv };
      const pid = data.params.context.pid;
      open({
        create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) => {
          const result = createProcess({ name, namespace, kind: '', project, pid });
          frame?.postMessage({ method: 'dataChanged' });
          frame?.postMessage({ method: 'validation' });
          return result;
        },
        defaultName: 'NewCallable',
        title: 'Create new Process',
        project,
        pid
      });
    },
    [createProcess, open]
  );
};

export const useNewFormActionHandler = () => {
  const { createForm } = useCreateForm();
  const open = useNewArtifact();
  return useCallback(
    (data: unknown) => {
      if (!isActionWithId(data, 'newHtmlDialog')) {
        return;
      }
      const project = { app: data.params.context.app, pmv: data.params.context.pmv };
      const pid = data.params.context.pid;
      open({
        create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
          createForm({ name, namespace, type: 'Form', project, pid }),
        defaultName: 'NewForm',
        title: 'Create new Form',
        project,
        pid
      });
    },
    [createForm, open]
  );
};
