import { useCallback } from 'react';
import { ProjectIdentifier } from '~/data/project-api';
import { Editor, useCreateEditor, useEditors } from '../useEditors';
import { FormActionHandler } from './form-client';

export const useActionHandler = (project: ProjectIdentifier, formEditorPath: string) => {
  const { openEditor } = useEditors();
  const { createEditorFromPath } = useCreateEditor();

  return useCallback<FormActionHandler>(
    action => {
      let editor: Editor | undefined;
      switch (action.actionId) {
        case 'openDataClass':
          editor = createEditorFromPath(project, `${formEditorPath}Data.d.json`);
          break;
        case 'openProcess':
          editor = createEditorFromPath(project, `${formEditorPath}Process.p.json`);
          break;
      }
      if (editor) {
        openEditor(editor);
      }
    },
    [createEditorFromPath, formEditorPath, openEditor, project]
  );
};
