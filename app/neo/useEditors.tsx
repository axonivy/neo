import { IvyIcons } from '@axonivy/ui-icons';
import { NavigationType, useNavigate, useNavigationType } from '@remix-run/react';
import { create } from 'zustand';
import { StorageValue, persist } from 'zustand/middleware';

export type Editor = { icon: IvyIcons; name: string; id: string };

type EditorType = 'processes';

type EditorState = {
  editors: Map<string, Editor>;
  close: (id: string) => void;
  open: (editor: Editor) => void;
};

const useStore = create<EditorState>()(
  persist(
    set => ({
      editors: new Map(),
      close: id =>
        set(state => {
          const editors = state.editors;
          editors.delete(id);
          return { editors };
        }),
      open: editor =>
        set(state => {
          const editors = state.editors;
          if (!editors.has(editor.id)) {
            editors.set(editor.id, editor);
          }
          return { editors };
        })
    }),
    {
      name: 'neo-editor-storage',
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              editors: new Map(state.editors)
            }
          };
        },
        setItem: (name, newValue: StorageValue<EditorState>) => {
          // functions cannot be JSON encoded
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              editors: Array.from(newValue.state.editors.entries())
            }
          });
          localStorage.setItem(name, str);
        },
        removeItem: name => localStorage.removeItem(name)
      }
    }
  )
);

export const useEditors = () => {
  const navigate = useNavigate();
  const { editors, open, close } = useStore();

  const closeEditor = (id: string) => {
    close(id);
    navigate(-1);
  };

  const openEditor = (editor: Editor) => {
    open(editor);
    navigate(editor.id);
  };

  const addEditor = (editor: Editor) => {
    open(editor);
  };

  return { editors, closeEditor, openEditor, addEditor };
};

export const editorId = (editorType: EditorType, path: string) => {
  return `/${editorType}/${path}`;
};

export const useRestoreEditor = (editorType: EditorType, pathname?: string) => {
  const navigationType = useNavigationType();
  const { editors, addEditor } = useEditors();
  if (navigationType !== NavigationType.Pop || !pathname) {
    return;
  }
  const editor = editorOfPath(editorType, pathname);
  if (!editors.has(editor.id)) {
    addEditor(editor);
  }
};

export const editorOfPath = (editorType: EditorType, pathname: string) => {
  const id = editorId(editorType, pathname);
  return { icon: IvyIcons.Process, name: pathname.split('/').at(-1) ?? pathname, id };
};
