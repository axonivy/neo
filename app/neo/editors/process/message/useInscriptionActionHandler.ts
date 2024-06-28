import { useCallback } from 'react';
import { InscriptionActionArgs, InscriptionNotificationTypes } from '@axonivy/inscription-protocol';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateProcess } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { useCreateForm } from '~/data/form-api';
import { createFormEditor, createProcessEditor, useEditors } from '../../useEditors';

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

export const useNewProcessActionHandler = () => {
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const open = useNewArtifact();
  return useCallback(
    (data: unknown, window: WindowProxy | null) => {
      if (!isActionWithId(data, 'newProcess')) {
        return;
      }
      const project = { app: data.params.context.app, pmv: data.params.context.pmv };
      const pid = data.params.context.pid;
      const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
        createProcess({ name, namespace, kind: '', project, pid })
          .then(process => {
            refreshInscriptionView(window);
            return process;
          })
          .then(process => openEditor(createProcessEditor(process)));
      open({ create, defaultName: 'NewCallable', title: 'Create new Process', project, pid });
    },
    [createProcess, open, openEditor]
  );
};

export const useNewFormActionHandler = () => {
  const { createForm } = useCreateForm();
  const { openEditor } = useEditors();
  const open = useNewArtifact();
  return useCallback(
    (data: unknown, window: WindowProxy | null) => {
      if (!isActionWithId(data, 'newHtmlDialog')) {
        return;
      }
      const project = { app: data.params.context.app, pmv: data.params.context.pmv };
      const pid = data.params.context.pid;
      const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
        createForm({ name, namespace, type: 'Form', project, pid })
          .then(form => {
            refreshInscriptionView(window);
            return form;
          })
          .then(form => openEditor(createFormEditor(form)));
      open({ create, defaultName: 'NewForm', title: 'Create new Form', project, pid });
    },
    [createForm, open, openEditor]
  );
};

const refreshInscriptionView = (window: WindowProxy | null) => {
  sendInscriptionNotification(window, 'dataChanged');
  sendInscriptionNotification(window, 'validation');
};

const sendInscriptionNotification = (window: WindowProxy | null, type: keyof InscriptionNotificationTypes) => {
  window?.postMessage({ method: type });
};
