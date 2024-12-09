import { indexOf } from '@axonivy/ui-components';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DataClassEditor } from './dataclass/DataClassEditor';
import { DIALOG_DATA_EDITOR_SUFFIX, DIALOG_PROCESS_EDITOR_SUFFIX, type Editor } from './editor';
import { FormEditor } from './form/FormEditor';
import { ProcessEditor } from './process/ProcessEditor';
import { TextEditor } from './text/TextEditor';
import { useCreateEditor } from './useCreateEditor';
import { VariableEditor } from './variable/VariableEditor';

type EditorState = {
  workspaces: Record<string, Array<Editor>>;
  close: (ws: string, ids: Array<string>) => Editor | undefined;
  closeAll: (ws: string) => void;
  open: (ws: string, editor: Editor) => void;
};

const useStore = create<EditorState>()(
  persist(
    set => ({
      workspaces: {},
      close: (ws, ids) => {
        let nextEditor: Editor | undefined;
        set(state => {
          const workspaces = structuredClone(state.workspaces);
          const editors = workspaces[ws] ?? [];
          let index = 0;
          ids.forEach(id => {
            index = indexOf(editors, e => e.id === id);
            editors.splice(index, 1);
          });
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
  const { createEditorFromPath } = useCreateEditor();

  const closeEditors = useCallback(
    (ids: Array<string>) => {
      const nextEditor = close(ws, ids);
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
      if (editor.type === 'forms') {
        open(ws, createEditorFromPath(editor.project, `${editor.path}${DIALOG_PROCESS_EDITOR_SUFFIX}`, 'processes'));
        open(ws, createEditorFromPath(editor.project, `${editor.path}${DIALOG_DATA_EDITOR_SUFFIX}`, 'dataclasses'));
      }
    },
    [createEditorFromPath, navigate, open, ws]
  );

  const removeEditor = useCallback(
    (id: string) => {
      close(ws, [id]);
    },
    [close, ws]
  );

  const addEditor = useCallback(
    (editor: Editor) => {
      open(ws, editor);
    },
    [open, ws]
  );

  return { editors: workspaces[ws] ?? [], closeEditors, openEditor, removeEditor, addEditor, closeAllEditors };
};

export const renderEditor = (editor: Editor) => {
  switch (editor.type) {
    case 'processes':
      return <ProcessEditor key={editor.id} {...editor} />;
    case 'forms':
      return <FormEditor key={editor.id} {...editor} />;
    case 'variables':
      return <VariableEditor key={editor.id} {...editor} />;
    case 'configurations':
      return <TextEditor key={editor.id} {...editor} />;
    case 'dataclasses':
      return <DataClassEditor key={editor.id} {...editor} />;
  }
};
