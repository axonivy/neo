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
  editors: Array<Editor>;
  close: (id: string) => void;
  closeAll: () => void;
  open: (editor: Editor) => void;
};

const useStore = create<EditorState>()(
  persist(
    set => ({
      editors: [],
      close: id =>
        set(state => {
          const editors = structuredClone(state.editors);
          const index = indexOf(editors, e => e.id === id);
          editors.splice(index, 1);
          return { editors };
        }),
      closeAll: () => set({ editors: [] }),
      open: editor =>
        set(state => {
          const editors = structuredClone(state.editors);
          const index = indexOf(editors, e => e.id === editor.id);
          if (index === -1) {
            editors.push(editor);
          }
          return { editors };
        })
    }),
    { name: 'neo-open-editors', version: 1 }
  )
);

export const useEditors = () => {
  const navigate = useNavigate();
  const { editors, open, close, closeAll } = useStore();

  const closeEditor = useCallback(
    (id: string) => {
      close(id);
      let nav = '/';
      if (editors.length > 0) {
        nav = editors[0].id;
      }
      navigate(nav, { replace: true });
    },
    [close, editors, navigate]
  );

  const closeAllEditors = useCallback(() => {
    closeAll();
    navigate('/', { replace: true });
  }, [closeAll, navigate]);

  const openEditor = useCallback(
    (editor: Editor) => {
      navigate(editor.id);
      open(editor);
    },
    [navigate, open]
  );

  const removeEditor = useCallback(
    (id: string) => {
      close(id);
    },
    [close]
  );

  const addEditor = useCallback(
    (editor: Editor) => {
      open(editor);
    },
    [open]
  );

  return { editors, closeEditor, openEditor, removeEditor, addEditor, closeAllEditors };
};

export const useRestoreEditor = (editorType: EditorType) => {
  const { app, pmv, '*': path } = useParams();
  const navigationType = useNavigationType();
  const { editors, addEditor } = useEditors();
  if (navigationType !== NavigationType.Pop || !app || !pmv || !path) {
    return;
  }
  const editor = createEditorFromPath(editorType, { app, pmv }, path);
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

export const createProcessEditor = ({ name, path, processIdentifier: { project }, kind, namespace }: Process): Editor => {
  if (kind === 3) {
    path = `${namespace}/${name}`;
    return createEditor('src_hd', project, path, name);
  }
  return createEditor('processes', project, path ?? name, name);
};

export const createFormEditor = ({ name, path, identifier: { project } }: Form): Editor => {
  return createEditor('forms', project, path, name);
};

export const createVariableEditor = (project: ProjectIdentifier): Editor => {
  return createEditor('configurations', project, 'variables', 'variables');
};

export const createEditorFromPath = (editorType: EditorType, project: ProjectIdentifier, path: string): Editor => {
  return createEditor(editorType, project, path, path.split('/').at(-1) ?? path);
};

const createEditor = (editorType: EditorType, project: ProjectIdentifier, path: string, name: string): Editor => {
  const id = `/${editorType}/${project.app}/${project.pmv}/${path}`;
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
