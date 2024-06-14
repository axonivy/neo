import { indexOf } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavigationType, useNavigate, useNavigationType } from '@remix-run/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormEditor } from '~/routes/forms.$app.$pmv.$/FormEditor';
import { ProcessEditor } from '~/routes/processes.$app.$pmv.$/ProcessEditor';

export type EditorType = 'processes' | 'forms';

export type Editor = { id: string; type: EditorType; icon: IvyIcons; name: string; app: string; pmv: string; path: string };

type EditorState = {
  editors: Array<Editor>;
  close: (id: string) => void;
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
    { name: 'neo-open-editors' }
  )
);

export const useEditors = () => {
  const navigate = useNavigate();
  const { editors, open, close } = useStore();

  const closeEditor = (id: string) => {
    close(id);
    let nav = '/';
    if (editors.length > 0) {
      nav = editors[0].id;
    }
    navigate(nav, { replace: true });
  };

  const openEditor = (editor: Editor) => {
    navigate(editor.id);
    open(editor);
  };

  const addEditor = (editor: Editor) => {
    open(editor);
  };

  return { editors, closeEditor, openEditor, addEditor };
};

export const editorId = (editorType: EditorType, app: string, pmv: string, path: string) => {
  return `/${editorType}/${app}/${pmv}/${path}`.replaceAll('//', '/');
};

export const useRestoreEditor = (editorType: EditorType, app?: string, pmv?: string, path?: string) => {
  const navigationType = useNavigationType();
  const { editors, addEditor } = useEditors();
  if (navigationType !== NavigationType.Pop || !app || !pmv || !path) {
    return;
  }
  const editor = editorOfPath(editorType, app, pmv, path);
  const index = indexOf(editors, e => e.id === editor.id);
  if (index === -1) {
    addEditor(editor);
  }
};

export const editorOfPath = (type: EditorType, app: string, pmv: string, path: string): Editor => {
  const id = editorId(type, app, pmv, path);
  return { id, type, icon: IvyIcons.Process, name: path.split('/').at(-1) ?? path, app, pmv, path };
};

export const renderEditor = (editor: Editor) => {
  switch (editor.type) {
    case 'processes':
      return <ProcessEditor key={editor.id} {...editor} />;
    case 'forms':
      return <FormEditor key={editor.id} {...editor} />;
  }
};
