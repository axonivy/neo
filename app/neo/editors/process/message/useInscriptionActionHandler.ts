import type { InscriptionActionArgs, InscriptionNotificationTypes } from '@axonivy/process-editor-inscription-protocol';
import { useCallback } from 'react';
import { useCreateForm } from '~/data/form-api';
import { useCreateProcess } from '~/data/process-api';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { useFormExists } from '~/routes/forms/overview';
import { useProcessExists } from '~/routes/processes/overview';
import { useCreateEditor } from '../../useCreateEditor';
import { useEditors } from '../../useEditors';

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
  const { createProcessEditor } = useCreateEditor();
  const projects = useSortedProjects();
  const processExists = useProcessExists();
  return useCallback(
    (data: unknown, window: WindowProxy | null) => {
      if (!isActionWithId(data, 'newProcess')) {
        return;
      }
      const project = projects.data?.find(p => p.id.pmv === data.params.context.pmv && p.id.app === data.params.context.app);
      const pid = data.params.context.pid;
      const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
        createProcess({ name, namespace, kind: '', project, pid }).then(process => {
          refreshInscriptionView(window);
          openEditor(createProcessEditor(process));
        });
      const exists = ({ name, namespace, project }: NewArtifactIdentifier) => processExists({ name, namespace, project });
      open({
        create,
        exists,
        type: 'Process',
        project,
        pid,
        namespaceRequired: false
      });
    },
    [createProcess, createProcessEditor, open, openEditor, processExists, projects.data]
  );
};

export const useNewFormActionHandler = () => {
  const { createForm } = useCreateForm();
  const { openEditor } = useEditors();
  const open = useNewArtifact();
  const { createFormEditor } = useCreateEditor();
  const projects = useSortedProjects();
  const formExists = useFormExists();
  return useCallback(
    (data: unknown, window: WindowProxy | null) => {
      if (!isActionWithId(data, 'newHtmlDialog')) {
        return;
      }
      const project = projects.data?.find(p => p.id.pmv === data.params.context.pmv && p.id.app === data.params.context.app);
      const pid = data.params.context.pid;
      const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
        createForm({ name, namespace, project, pid }).then(form => {
          refreshInscriptionView(window);
          openEditor(createFormEditor(form));
        });
      const exists = ({ name, namespace, project }: NewArtifactIdentifier) => formExists({ name, namespace, project });
      open({ create, exists, type: 'Form', namespaceRequired: true, project, pid });
    },
    [createForm, createFormEditor, formExists, open, openEditor, projects.data]
  );
};

export const useOpenPageActionHandler = () => {
  return useCallback((data: unknown) => {
    if (!isActionWithId(data, 'openPage')) {
      return;
    }
    window.open(data.params.payload as string);
  }, []);
};

const refreshInscriptionView = (window: WindowProxy | null) => {
  sendInscriptionNotification(window, 'dataChanged');
  sendInscriptionNotification(window, 'validation');
};

const sendInscriptionNotification = (window: WindowProxy | null, type: keyof InscriptionNotificationTypes) => {
  window?.postMessage({ method: type });
};
