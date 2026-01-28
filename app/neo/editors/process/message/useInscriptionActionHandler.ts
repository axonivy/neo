import type { InscriptionActionArgs, InscriptionNotificationTypes } from '@axonivy/process-editor-inscription-protocol';
import { toast } from '@axonivy/ui-components';
import { useCallback } from 'react';
import { useCreateForm } from '~/data/form-api';
import { useCreateProcess } from '~/data/process-api';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { useFormExists } from '~/routes/forms/overview';
import { useProcessExists } from '~/routes/processes/overview';
import { noUnknownAction } from '~/utils/no-unknown-action';

export const useActionHandler = () => {
  const newProcessHandler = useNewProcessActionHandler();
  const newFormHandler = useNewFormActionHandler();
  const openPageHandler = useOpenPageActionHandler();
  return useCallback(
    (data: unknown, window: WindowProxy | null) => {
      if (!isAction(data)) {
        return;
      }
      const actionId = data.params.actionId;
      switch (actionId) {
        case 'newProcess':
          newProcessHandler(data.params, window);
          break;
        case 'newHtmlDialog':
          newFormHandler(data.params, window);
          break;
        case 'openPage':
          openPageHandler(data.params);
          break;
        case 'openOrCreateCmsCategory':
          //TODO: open cms editor
          break;
        case 'newRestClient':
        case 'openRestConfig':
        case 'newWebServiceClient':
        case 'openWsConfig':
        case 'newDatabaseConfig':
        case 'openDatabaseConfig':
        case 'openCustomField':
        case 'openEndPage':
        case 'openProgram':
        case 'newProgram':
          toast.warning(`The action '${actionId}' is not supported.`);
          break;
        default:
          noUnknownAction(actionId);
          break;
      }
    },
    [newProcessHandler, newFormHandler, openPageHandler]
  );
};

export const useNewProcessActionHandler = () => {
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const open = useNewArtifact();
  const { createProcessEditor } = useCreateEditor();
  const projects = useSortedProjects();
  const exists = useProcessExists();
  return useCallback(
    (args: InscriptionActionArgs, window: WindowProxy | null) => {
      const project = projects.data?.find(p => p.id.pmv === args.context.pmv && p.id.app === args.context.app);
      const pid = args.context.pid;
      const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
        createProcess({ name, namespace, kind: '', project, pid }).then(process => {
          refreshInscriptionView(window);
          openEditor(createProcessEditor(process));
        });
      open({
        create,
        exists,
        type: 'Process',
        project,
        pid,
        namespaceRequired: false
      });
    },
    [createProcess, createProcessEditor, exists, open, openEditor, projects.data]
  );
};

export const useNewFormActionHandler = () => {
  const { createForm } = useCreateForm();
  const { openEditor } = useEditors();
  const open = useNewArtifact();
  const { createFormEditor } = useCreateEditor();
  const projects = useSortedProjects();
  const exists = useFormExists();
  return useCallback(
    (args: InscriptionActionArgs, window: WindowProxy | null) => {
      const project = projects.data?.find(p => p.id.pmv === args.context.pmv && p.id.app === args.context.app);
      const pid = args.context.pid;
      const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) =>
        createForm({ name, namespace, project, pid }).then(form => {
          refreshInscriptionView(window);
          openEditor(createFormEditor(form));
        });
      open({ create, exists, type: 'Form', namespaceRequired: true, project, pid });
    },
    [createForm, createFormEditor, exists, open, openEditor, projects.data]
  );
};

export const useOpenPageActionHandler = () => {
  return useCallback((args: InscriptionActionArgs) => window.open(args.payload as string), []);
};

const refreshInscriptionView = (window: WindowProxy | null) => {
  sendInscriptionNotification(window, 'dataChanged');
  sendInscriptionNotification(window, 'validation');
};

const sendInscriptionNotification = (window: WindowProxy | null, type: keyof InscriptionNotificationTypes) => {
  window?.postMessage({ method: type });
};

const isAction = (obj: unknown): obj is { method: string; params: InscriptionActionArgs } =>
  typeof obj === 'object' &&
  obj !== null &&
  'method' in obj &&
  obj.method === 'action' &&
  'params' in obj &&
  typeof obj.params === 'object' &&
  obj.params !== null &&
  'actionId' in obj.params;
