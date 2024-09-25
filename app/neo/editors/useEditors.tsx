import { indexOf } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavigationType, useNavigate, useNavigationType, useParams } from '@remix-run/react';
import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Form } from '~/data/form-api';
import { DataClassBean } from '~/data/generated/openapi-dev';
import { Process } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { DataClassEditor } from './DataClassEditor';
import { FormEditor } from './FormEditor';
import { ProcessEditor } from './process/ProcessEditor';
import { VariableEditor } from './VariableEditor';

export type EditorType = 'processes' | 'forms' | 'configurations' | 'dataclasses';

// if you change the Editor type increase the persist version too
export type Editor = { id: string; type: EditorType; icon: IvyIcons; name: string; project: ProjectIdentifier; path: string };

type EditorState = {
  workspaces: Record<string, Array<Editor>>;
  close: (ws: string, id: string) => Editor | undefined;
  closeAll: (ws: string) => void;
  open: (ws: string, editor: Editor) => void;
};

const useStore = create<EditorState>()(
  persist(
    set => ({
      workspaces: {},
      close: (ws, id) => {
        let nextEditor: Editor | undefined;
        set(state => {
          const workspaces = structuredClone(state.workspaces);
          const editors = workspaces[ws] ?? [];
          const index = indexOf(editors, e => e.id === id);
          editors.splice(index, 1);
          nextEditor = editors[index - 1] ?? editors[index];
          workspaces[ws] = editors;
          return { workspaces };
        });
        return nextEditor;
      },
      closeAll: ws =>
        set(state => {
          const workspaces = structuredClone(state.workspaces);
          delete workspaces[ws];
          return { workspaces };
        }),
      open: (ws, editor) =>
        set(state => {
          const workspaces = structuredClone(state.workspaces);
          const editors = workspaces[ws] ?? [];
          const index = indexOf(editors, e => e.id === editor.id);
          if (index === -1) {
            editors.push(editor);
          }
          workspaces[ws] = editors;
          return { workspaces };
        })
    }),
    { name: 'neo-open-editors', version: 2 }
  )
);

export const useEditors = () => {
  const navigate = useNavigate();
  const ws = useParams().ws ?? '';
  const rootNav = `/${ws}`;
  const { workspaces, open, close, closeAll } = useStore();

  const closeEditor = useCallback(
    (id: string) => {
      const nextEditor = close(ws, id);
      navigate(nextEditor ? nextEditor.id : rootNav, { replace: true });
    },
    [close, navigate, rootNav, ws]
  );

  const closeAllEditors = useCallback(() => {
    closeAll(ws);
    navigate(rootNav, { replace: true });
  }, [closeAll, navigate, rootNav, ws]);

  const openEditor = useCallback(
    (editor: Editor) => {
      navigate(editor.id);
      open(ws, editor);
    },
    [navigate, open, ws]
  );

  const removeEditor = useCallback(
    (id: string) => {
      close(ws, id);
    },
    [close, ws]
  );

  const addEditor = useCallback(
    (editor: Editor) => {
      open(ws, editor);
    },
    [open, ws]
  );

  return { editors: workspaces[ws] ?? [], closeEditor, openEditor, removeEditor, addEditor, closeAllEditors };
};

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

export const renderEditor = (editor: Editor) => {
  switch (editor.type) {
    case 'processes':
      return <ProcessEditor key={editor.id} {...editor} />;
    case 'forms':
      return <FormEditor key={editor.id} {...editor} />;
    case 'configurations':
      return <VariableEditor key={editor.id} {...editor} />;
    case 'dataclasses':
      return <DataClassEditor key={editor.id} {...editor} />;
  }
};

export const useCreateEditor = () => {
  const ws = useParams().ws ?? 'designer';
  return {
    createFormEditor: ({ name, path, identifier: { project } }: Form): Editor => createEditor(ws, 'forms', project, `src_hd/${path}`, name),
    createProcessEditor: ({ name, path, processIdentifier: { project }, kind, namespace }: Process): Editor => {
      if (kind === 'HTML_DIALOG') {
        path = `src_hd/${namespace}/${name}`;
        return createEditor(ws, 'processes', project, path, name);
      }
      return createEditor(ws, 'processes', project, `processes/${path ?? name}`, name);
    },
    createVariableEditor: (project: ProjectIdentifier): Editor => createEditor(ws, 'configurations', project, 'variables', 'variables'),
    createDataClassEditor: ({ simpleName, path, dataClassIdentifier: { project } }: DataClassBean): Editor =>
      createEditor(ws, 'dataclasses', project, path, simpleName),
    createEditorFromPath: (project: ProjectIdentifier, path: string, editorType?: EditorType): Editor =>
      createEditor(ws, editorType ?? typeFromPath(path), project, path, path.split('/').at(-1) ?? path)
  };
};

const createEditor = (ws: string, editorType: EditorType, project: ProjectIdentifier, path: string, name: string): Editor => {
  const id = `/${ws}/${editorType}/${project.app}/${project.pmv}/${path}`;
  return {
    id: removeExtension(id),
    type: editorType,
    icon: editorIcon(editorType),
    name: removeExtension(name),
    project,
    path: removeExtension(path)
  };
};

const removeExtension = (path: string) => {
  return path.split('.p.json')[0].split('.f.json')[0].split('.d.json')[0];
};

const typeFromPath = (path: string): EditorType => {
  if (path.endsWith('.p.json')) {
    return 'processes';
  }
  if (path.endsWith('.f.json')) {
    return 'forms';
  }
  if (path.endsWith('.d.json')) {
    return 'dataclasses';
  }
  return 'configurations';
};

const editorIcon = (editorType: EditorType) => {
  switch (editorType) {
    case 'forms':
      return IvyIcons.File;
    case 'configurations':
      return IvyIcons.Tool;
    case 'dataclasses':
      return IvyIcons.Database;
  }
  return IvyIcons.Process;
};
