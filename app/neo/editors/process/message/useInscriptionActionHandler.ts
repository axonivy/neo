import type { InscriptionActionArgs, InscriptionNotificationTypes } from '@axonivy/process-editor-inscription-protocol';
import { toast } from '@axonivy/ui-components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateForm } from '~/data/form-api';
import { useCreateProcess } from '~/data/process-api';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { useFormExists } from '~/routes/forms/overview';
import { useProcessExists } from '~/routes/processes/overview';
import { noUnknownAction } from '~/utils/no-unknown';

export const useActionHandler = () => {
  const { t } = useTranslation();
  const newProcessHandler = useNewProcessActionHandler();
  const newFormHandler = useNewFormActionHandler();
  const openPageHandler = useOpenPageActionHandler();
  const openCmsHandler = useOpenCmsActionHandler();
  const openConfigEditorHandler = useOpenConfigEditorHandler();
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
          openCmsHandler(data.params);
          break;
        case 'newRestClient':
        case 'openRestConfig':
          openConfigEditorHandler(data.params, 'rest-clients');
          break;
        case 'newDatabaseConfig':
        case 'openDatabaseConfig':
          openConfigEditorHandler(data.params, 'databases');
          break;
        case 'newWebServiceClient':
        case 'openWsConfig':
        case 'openCustomField':
        case 'openEndPage':
        case 'openProgram':
        case 'newProgram':
          toast.warning(t('message.unsupportedAction', { action: actionId }));
          break;
        default:
          noUnknownAction(actionId);
          break;
      }
    },
    [newProcessHandler, newFormHandler, openPageHandler, openCmsHandler, openConfigEditorHandler, t]
  );
};

const useNewProcessActionHandler = () => {
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

const useNewFormActionHandler = () => {
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

const useOpenPageActionHandler = () => useCallback((args: InscriptionActionArgs) => window.open(args.payload as string), []);

const useOpenCmsActionHandler = () => {
  const { openEditor } = useEditors();
  const { createCmsEditor } = useCreateEditor();
  const projects = useSortedProjects();
  const { t } = useTranslation();
  return useCallback(
    (args: InscriptionActionArgs) => {
      const project = projects.data?.find(p => p.id.pmv === args.context.pmv && p.id.app === args.context.app);
      if (!project) {
        toast.warning(t('message.couldNotOpenCmsEditor'));
        return;
      }
      openEditor(createCmsEditor(project.id));
    },
    [createCmsEditor, openEditor, projects.data, t]
  );
};

const useOpenConfigEditorHandler = () => {
  const { openEditor } = useEditors();
  const { createConfigurationEditor } = useCreateEditor();
  const projects = useSortedProjects();
  const { t } = useTranslation();
  return useCallback(
    (args: InscriptionActionArgs, file: 'rest-clients' | 'databases') => {
      const project = projects.data?.find(p => p.id.pmv === args.context.pmv && p.id.app === args.context.app);
      if (!project) {
        toast.warning(t('message.couldNotOpenConfigEditor', { config: file }));
        return;
      }
      const config = { project: project.id, path: `config/${file}.yaml` };
      openEditor(createConfigurationEditor(config));
    },
    [createConfigurationEditor, openEditor, projects.data, t]
  );
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
