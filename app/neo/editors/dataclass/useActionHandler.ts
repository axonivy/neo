import { DataClassActionArgs } from '@axonivy/dataclass-editor';
import { useCallback } from 'react';
import { ProjectIdentifier } from '~/data/project-api';
import { useCreateEditor } from '../useCreateEditor';
import { useEditors } from '../useEditors';
import { DataClassActionHandler } from './data-class-client';

const editorPath = (action: DataClassActionArgs, dataClassEditorPath: string) => {
  const editorPath = dataClassEditorPath.substring(0, dataClassEditorPath.lastIndexOf('Data'));
  switch (action.actionId) {
    case 'openForm':
      return `${editorPath}.f.json`;
    case 'openProcess':
      return `${editorPath}Process.p.json`;
  }
  return editorPath;
};

export const useActionHandler = (project: ProjectIdentifier, dataClassEditorPath: string) => {
  const { openEditor } = useEditors();
  const { createEditorFromPath } = useCreateEditor();

  return useCallback<DataClassActionHandler>(
    action => openEditor(createEditorFromPath(project, editorPath(action, dataClassEditorPath))),
    [createEditorFromPath, dataClassEditorPath, openEditor, project]
  );
};
