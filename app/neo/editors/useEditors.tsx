import { indexOf } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavigationType, useNavigate, useNavigationType, useParams } from '@remix-run/react';
import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Form } from '~/data/form-api';
import { Process } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { FormEditor } from './FormEditor';
import { ProcessEditor } from './process/ProcessEditor';
import { VariableEditor } from './VariableEditor';

export type EditorType = 'processes' | 'forms' | 'src_hd' | 'configurations';

// if you change the Editor type increase the persist version too
export type Editor = { id: string; type: EditorType; icon: IvyIcons; name: string; project: ProjectIdentifier; path: string };

type EditorState = {
  workspaces: Record<string, Array<Editor>>;
  close: (ws: string, id: string) => void;
  closeAll: (ws: string) => void;
  open: (ws: string, editor: Editor) => void;
};

const useStore = create<EditorState>()(
  persist(
    set => ({
      workspaces: {},
      close: (ws, id) =>
        set(state => {
          const workspaces = structuredClone(state.workspaces);
          const editors = workspaces[ws] ?? [];
          const index = indexOf(editors, e => e.id === id);
          editors.splice(index, 1);
          workspaces[ws] = editors;
          return { workspaces };
        }),
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
      close(ws, id);
      let nav = rootNav;
      if (workspaces[ws]?.length > 0) {
        nav = workspaces[ws][0].id;
      }
      navigate(nav, { replace: true });
    },
    [close, navigate, rootNav, workspaces, ws]
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
  const navigationType = useNavigationType();
  const { editors, addEditor } = useEditors();
  if (navigationType !== NavigationType.Pop || !ws || !app || !pmv || !path) {
    return;
  }
  const editor = createEditorFromPath(ws, editorType, { app, pmv }, path);
  const index = indexOf(editors, e => e.id === editor.id);
  if (index === -1) {
    addEditor(editor);
  }
};

export const renderEditor = (editor: Editor) => {
  switch (editor.type) {
    case 'processes':
    case 'src_hd':
      return <ProcessEditor key={editor.id} {...editor} />;
    case 'forms':
      return <FormEditor key={editor.id} {...editor} />;
    case 'configurations':
      return <VariableEditor key={editor.id} {...editor} />;
  }
};

export const createProcessEditor = ({
  ws,
  name,
  path,
  processIdentifier: { project },
  kind,
  namespace
}: { ws: string } & Process): Editor => {
  if (kind === 3) {
    path = `${namespace}/${name}`;
    return createEditor(ws, 'src_hd', project, path, name);
  }
  return createEditor(ws, 'processes', project, path ?? name, name);
};

export const createFormEditor = ({ ws, name, path, identifier: { project } }: { ws: string } & Form): Editor => {
  return createEditor(ws, 'forms', project, path, name);
};

export const createVariableEditor = ({ ws, ...project }: { ws: string } & ProjectIdentifier): Editor => {
  return createEditor(ws, 'configurations', project, 'variables', 'variables');
};

export const createEditorFromPath = (ws: string, editorType: EditorType, project: ProjectIdentifier, path: string): Editor => {
  return createEditor(ws, editorType, project, path, path.split('/').at(-1) ?? path);
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
  return path.split('.p.json')[0].split('.f.json')[0];
};

const editorIcon = (editorType: EditorType) => {
  switch (editorType) {
    case 'forms':
      return IvyIcons.File;
    case 'configurations':
      return IvyIcons.Tool;
  }
  return IvyIcons.Process;
};
