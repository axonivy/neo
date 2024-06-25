import { indexOf } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavigationType, useNavigate, useNavigationType } from '@remix-run/react';
import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectIdentifier } from '~/data/project-api';
import { FormEditor } from '~/routes/forms.$app.$pmv.$/FormEditor';
import { ProcessEditor } from '~/routes/processes.$app.$pmv.$/ProcessEditor';

export type EditorType = 'processes' | 'forms' | 'src_hd';

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
          const editors = state.editors;
          const index = indexOf(editors, e => e.id === id);
          editors.splice(index, 1);
          return { editors };
        }),
      closeAll: () => set({ editors: [] }),
      open: editor =>
        set(state => {
          const editors = state.editors;
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

export const editorId = (editorType: EditorType, project: ProjectIdentifier, path: string) => {
  const id = `/${editorType}/${project.app}/${project.pmv}/${path}`;
  if (editorType === 'forms') {
    return id.split('.f.json')[0];
  }
  return id;
};

export const useRestoreEditor = (editorType: EditorType, app?: string, pmv?: string, path?: string) => {
  const navigationType = useNavigationType();
  const { editors, addEditor } = useEditors();
  if (navigationType !== NavigationType.Pop || !app || !pmv || !path) {
    return;
  }
  const editor = editorOfPath(editorType, { app, pmv }, path);
  const index = indexOf(editors, e => e.id === editor.id);
  if (index === -1) {
    addEditor(editor);
  }
};

export const editorOfPath = (type: EditorType, project: ProjectIdentifier, path: string): Editor => {
  const id = editorId(type, project, path);
  return { id, type, icon: editorIcon(type), name: path.split('/').at(-1) ?? path, project, path };
};

export const renderEditor = (editor: Editor) => {
  switch (editor.type) {
    case 'processes':
    case 'src_hd':
      return <ProcessEditor key={editor.id} {...editor} />;
    case 'forms':
      return <FormEditor key={editor.id} {...editor} />;
  }
};

export const editorIcon = (editorType: EditorType) => {
  if (editorType === 'forms') {
    return IvyIcons.File;
  }
  return IvyIcons.Process;
};
