import { indexOf } from '@axonivy/ui-components';
import { NavigationType, useNavigationType, useParams } from 'react-router';
import type { EditorType } from './editor';
import { useCreateEditor } from './useCreateEditor';
import { useEditors } from './useEditors';

export const useRestoreEditor = (editorType: EditorType) => {
  const { ws, app, pmv, '*': path } = useParams();
  const { createEditorFromPath } = useCreateEditor();
  const navigationType = useNavigationType();
  const { editors, addEditor } = useEditors();
  if (navigationType !== NavigationType.Pop || !ws || !app || !pmv || !path) {
    return;
  }
  const editor = createEditorFromPath({ app, pmv }, path, editorType);
  const index = indexOf(editors, e => e.id === editor.id);
  if (index === -1) {
    addEditor(editor);
  }
};
