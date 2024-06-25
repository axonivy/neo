import { useCallback } from 'react';
import { useNewArtifactDialog } from '~/neo/dialog/useNewArtifactDialog';
import { ProjectIdentifier } from '~/data/project-api';
import { isActionWithId } from './useNewProcessActionHandler';
import { useCreateForm } from '~/data/form-api';

export const useNewFormActionHandler = () => {
  const { createForm } = useCreateForm();
  const { open } = useNewArtifactDialog();
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
