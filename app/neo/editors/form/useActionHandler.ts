import type { FormActionArgs } from '@axonivy/form-editor-protocol';
import { useCallback } from 'react';
import type { ProjectIdentifier } from '~/data/project-api';
import { DIALOG_DATA_EDITOR_SUFFIX, DIALOG_PROCESS_EDITOR_SUFFIX } from '../editor';
import { useCreateEditor } from '../useCreateEditor';
import { useEditors } from '../useEditors';
import { useOpenUrl } from '../useOpenUrl';
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
  const { createEditorFromPath } = useCreateEditor();
  const openUrl = useOpenUrl();
  return useCallback<FormActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
      openEditor(createEditorFromPath(project, editorPath(action, formEditorPath)));
    },
    [createEditorFromPath, formEditorPath, openEditor, openUrl, project]
  );
};
