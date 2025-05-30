import type { DataActionArgs } from '@axonivy/dataclass-editor-protocol/lib/editor';
import { useCallback } from 'react';
import type { ProjectIdentifier } from '~/data/project-api';
import { DIALOG_PROCESS_EDITOR_SUFFIX, FORM_EDITOR_SUFFIX } from '../editor';
import { useCreateEditor } from '../useCreateEditor';
import { useEditors } from '../useEditors';
import { useOpenUrl } from '../useOpenUrl';
import type { DataClassActionHandler } from './data-class-client';

const editorPath = (action: DataActionArgs, dataClassEditorPath: string) => {
  const editorPath = dataClassEditorPath.substring(0, dataClassEditorPath.lastIndexOf('Data'));
  switch (action.actionId) {
    case 'openForm':
      return `${editorPath}${FORM_EDITOR_SUFFIX}`;
    case 'openProcess':
      return `${editorPath}${DIALOG_PROCESS_EDITOR_SUFFIX}`;
  }
  return editorPath;
};

export const useActionHandler = (project: ProjectIdentifier, dataClassEditorPath: string) => {
  const { openEditor } = useEditors();
  const { createEditorFromPath } = useCreateEditor();
  const openUrl = useOpenUrl();
  return useCallback<DataClassActionHandler>(
    action => {
      if (action.actionId === 'openUrl') {
        openUrl(action.payload);
        return;
      }
      openEditor(createEditorFromPath(project, editorPath(action, dataClassEditorPath)));
    },
    [createEditorFromPath, dataClassEditorPath, openEditor, openUrl, project]
  );
};
