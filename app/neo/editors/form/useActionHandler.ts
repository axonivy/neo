import type { FormActionArgs } from '@axonivy/form-editor-protocol';
import { useCallback } from 'react';
import { useComponentForm } from '~/data/form-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { DIALOG_DATA_EDITOR_SUFFIX, DIALOG_PROCESS_EDITOR_SUFFIX } from '../editor';
import { useCreateEditor } from '../useCreateEditor';
import { useEditors } from '../useEditors';
import type { FormActionHandler } from './form-client';

const editorPath = (action: FormActionArgs, formEditorPath: string) => {
  switch (action.actionId) {
    case 'openDataClass':
      return `${formEditorPath}${DIALOG_DATA_EDITOR_SUFFIX}`;
    case 'openProcess':
      return `${formEditorPath}${DIALOG_PROCESS_EDITOR_SUFFIX}`;
  }
  return formEditorPath;
};

export const useActionHandler = (project: ProjectIdentifier, formEditorPath: string) => {
  const { openEditor } = useEditors();
  const { createEditorFromPath, createFormEditor } = useCreateEditor();
  const { getComponentForm } = useComponentForm();
  return useCallback<FormActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        window.open(action.payload);
        return;
      }
      if (action.actionId === 'openComponent') {
        getComponentForm({ componentId: action.payload, app: project.app, pmv: project.pmv })
          .unwrap()
          .then(form => {
            openEditor(createFormEditor(form));
          });
        return;
      }
      openEditor(createEditorFromPath(project, editorPath(action, formEditorPath)));
    },
    [createEditorFromPath, createFormEditor, formEditorPath, getComponentForm, openEditor, project]
  );
};
