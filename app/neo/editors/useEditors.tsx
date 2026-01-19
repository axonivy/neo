import { indexOf } from '@axonivy/ui-components';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CmsEditor } from './cms/CmsEditor';
import { DatabaseEditor } from './database/DatabaseEditor';
import { DataClassEditor } from './dataclass/DataClassEditor';
import { DIALOG_DATA_EDITOR_SUFFIX, DIALOG_PROCESS_EDITOR_SUFFIX, type Editor } from './editor';
import { FormEditor } from './form/FormEditor';
import { ProcessEditor } from './process/ProcessEditor';
import { RoleEditor } from './role/RoleEditor';
import { TextEditor } from './text/TextEditor';
import { useCreateEditor } from './useCreateEditor';
import { VariableEditor } from './variable/VariableEditor';

type EditorState = {
  openEditors: Record<string, Array<Editor>>;
  recentlyOpenedEditors: Record<string, Array<Editor>>;
  close: (ws: string, ids: Array<string>) => Editor | undefined;
  closeAll: (ws: string) => void;
  open: (ws: string, editor: Editor) => void;
  cleanupRecentlyOpened: (ws: string) => void;
  removeRecentlyOpened: (ws: string, id: string) => void;
};

const RECENTLY_OPENED_EDITORS_LIMIT = 10;

export const useStore = create<EditorState>()(
  persist(
    set => ({
      openEditors: {},
      recentlyOpenedEditors: {},
      close: (ws, ids) => {
        let nextEditor: Editor | undefined;
        set(state => {
          let openEditors = state.openEditors[ws] ?? [];
          let index = 0;
          ids.forEach(id => {
            index = indexOf(openEditors, e => e.id === id);
            openEditors = openEditors.toSpliced(index, 1);
          });
          nextEditor = openEditors[index - 1] ?? openEditors[index];
          return { openEditors: { ...state.openEditors, [ws]: openEditors } };
        });
        return nextEditor;
      },
      closeAll: ws => set(state => ({ openEditors: { ...state.openEditors, [ws]: [] } })),
      open: (ws, editor) =>
        set(state => {
          let openEditors = state.openEditors[ws] ?? [];
          let recentlyOpenedEditors = state.recentlyOpenedEditors[ws] ?? [];
          if (indexOf(openEditors, e => e.id === editor.id) === -1) {
            openEditors = [...openEditors, editor];
          }
          if (indexOf(recentlyOpenedEditors, e => e.id === editor.id) === -1) {
            recentlyOpenedEditors = [editor, ...recentlyOpenedEditors];
            recentlyOpenedEditors = recentlyOpenedEditors.slice(0, RECENTLY_OPENED_EDITORS_LIMIT);
          }
          return {
            openEditors: { ...state.openEditors, [ws]: openEditors },
            recentlyOpenedEditors: { ...state.recentlyOpenedEditors, [ws]: recentlyOpenedEditors }
          };
        }),
      cleanupRecentlyOpened: ws => set(state => ({ recentlyOpenedEditors: { ...state.recentlyOpenedEditors, [ws]: [] } })),
      removeRecentlyOpened: (ws, id) =>
        set(state => {
          let recentlyOpenedEditors = state.recentlyOpenedEditors[ws] ?? [];
          const index = indexOf(recentlyOpenedEditors, e => e.id === id);
          if (index !== -1) {
            recentlyOpenedEditors = recentlyOpenedEditors.toSpliced(index, 1);
          }
          return { recentlyOpenedEditors: { ...state.recentlyOpenedEditors, [ws]: recentlyOpenedEditors } };
        })
    }),
    { name: 'neo-open-editors', version: 3 }
  )
);

export const useEditors = () => {
  const navigate = useNavigate();
  const ws = useParams().ws ?? '';
  const rootNav = `/${ws}`;
  const openEditors = useStore(state => state.openEditors[ws]);
  const close = useStore(state => state.close);
  const closeAll = useStore(state => state.closeAll);
  const open = useStore(state => state.open);
  const { createEditorFromPath } = useCreateEditor();

  const closeEditors = useCallback(
    (ids: Array<string>) => {
      const nextEditor = close(ws, ids);
      const regex = new RegExp(`(?<=(${rootNav}/))[^/]+`);
      const navigationTarget = nextEditor ? nextEditor.id : rootNav + '/' + ids[0]?.match(regex)?.[0];
      navigate(navigationTarget, { replace: true });
    },
    [close, ws, rootNav, navigate]
  );

  const closeAllEditors = useCallback(() => {
    closeAll(ws);
    navigate(rootNav, { replace: true });
  }, [closeAll, ws, navigate, rootNav]);

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

  return {
    editors: openEditors ?? [],
    closeEditors,
    closeAllEditors,
    openEditor,
    removeEditor,
    addEditor
  };
};

export const useRecentlyOpenedEditors = () => {
  const ws = useParams().ws ?? '';
  const editors = useStore(state => state.recentlyOpenedEditors[ws]);
  const removeRecentlyOpened = useStore(state => state.removeRecentlyOpened);
  const cleanupRecentlyOpened = useStore(state => state.cleanupRecentlyOpened);
  return {
    editors: editors ?? [],
    removeRecentlyOpened: (id: string) => removeRecentlyOpened(ws, id),
    cleanupRecentlyOpened: () => cleanupRecentlyOpened(ws)
  };
};

export const renderEditor = (editor: Editor) => {
  switch (editor.type) {
    case 'processes':
      return <ProcessEditor {...editor} />;
    case 'forms':
      return <FormEditor {...editor} />;
    case 'variables':
      return <VariableEditor {...editor} />;
    case 'roles':
      return <RoleEditor {...editor} />;
    case 'cms':
      return <CmsEditor {...editor} />;
    case 'databases':
      return <DatabaseEditor {...editor} />;
    case 'configurations':
      return <TextEditor {...editor} />;
    case 'dataclasses':
      return <DataClassEditor {...editor} />;
  }
};
