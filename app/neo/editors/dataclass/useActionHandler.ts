import type { DataActionArgs } from '@axonivy/dataclass-editor-protocol';
import { useCallback } from 'react';
import type { ProjectIdentifier } from '~/data/project-api';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { DIALOG_PROCESS_EDITOR_SUFFIX, FORM_EDITOR_SUFFIX } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { noUnknownAction } from '~/utils/no-unknown';
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
      switch (action.actionId) {
        case 'openUrl':
          openUrl(action.payload);
          return;
        case 'openForm':
        case 'openProcess':
          openEditor(createEditorFromPath(project, editorPath(action, dataClassEditorPath)));
          break;
        default:
          noUnknownAction(action.actionId);
      }
    },
    [createEditorFromPath, dataClassEditorPath, openEditor, openUrl, project]
  );
};
