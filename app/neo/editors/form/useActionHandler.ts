import { FormActionArgs } from '@axonivy/form-editor-protocol';
import { useCallback } from 'react';
import { ProjectIdentifier } from '~/data/project-api';
import { useCreateEditor } from '../useCreateEditor';
import { useEditors } from '../useEditors';
import { FormActionHandler } from './form-client';

const editorPath = (action: FormActionArgs, formEditorPath: string) => {
  switch (action.actionId) {
    case 'openDataClass':
      return `${formEditorPath}Data.d.json`;
    case 'openProcess':
      return `${formEditorPath}Process.p.json`;
  }
  return formEditorPath;
};

export const useActionHandler = (project: ProjectIdentifier, formEditorPath: string) => {
  const { openEditor } = useEditors();
  const { createEditorFromPath } = useCreateEditor();

  return useCallback<FormActionHandler>(
    action => openEditor(createEditorFromPath(project, editorPath(action, formEditorPath))),
    [createEditorFromPath, formEditorPath, openEditor, project]
  );
};
