import { indexOf } from '@axonivy/ui-components';
import { NavigationType, useNavigationType, useParams } from 'react-router';
import type { EditorType } from './editor';
import { useCreateEditor } from './useCreateEditor';
import { useEditors } from './useEditors';

export const useRestoreEditor = (editorType?: EditorType) => {
  const { ws, app, project, '*': path } = useParams();
  const { createEditorFromPath } = useCreateEditor();
  const navigationType = useNavigationType();
  const { editors, addEditor } = useEditors();
  if (navigationType !== NavigationType.Pop || !ws || !app || !project || !path) {
    return;
  }
  const editor = createEditorFromPath({ app, project }, path, editorType);
  const index = indexOf(editors, e => e.id === editor.id);
  if (index === -1) {
    addEditor(editor);
  }
};
