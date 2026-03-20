import { Flex, indexOf, Spinner } from '@axonivy/ui-components';
import { lazy, Suspense, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { noUnknownType } from '~/utils/no-unknown';
import { DIALOG_DATA_EDITOR_SUFFIX, DIALOG_PROCESS_EDITOR_SUFFIX, type Editor } from './editor';
import { useCreateEditor } from './useCreateEditor';

const ProcessEditor = lazy(() => import('./process/ProcessEditor').then(module => ({ default: module.ProcessEditor })));
const FormEditor = lazy(() => import('./form/FormEditor').then(module => ({ default: module.FormEditor })));
const CaseMapEditor = lazy(() => import('./casemap/CaseMapEditor').then(module => ({ default: module.CaseMapEditor })));
const VariableEditor = lazy(() => import('./variable/VariableEditor').then(module => ({ default: module.VariableEditor })));
const RoleEditor = lazy(() => import('./role/RoleEditor').then(module => ({ default: module.RoleEditor })));
const UserEditor = lazy(() => import('./user/UserEditor').then(module => ({ default: module.UserEditor })));
const PersistenceEditor = lazy(() => import('./persistence/PersistenceEditor').then(module => ({ default: module.PersistenceEditor })));
const RestClientEditor = lazy(() => import('./restclient/RestClientEditor').then(module => ({ default: module.RestClientEditor })));
const WebserviceEditor = lazy(() => import('./webservice/WebserviceEditor').then(module => ({ default: module.WebserviceEditor })));
const CmsEditor = lazy(() => import('./cms/CmsEditor').then(module => ({ default: module.CmsEditor })));
const DatabaseEditor = lazy(() => import('./database/DatabaseEditor').then(module => ({ default: module.DatabaseEditor })));
const DataClassEditor = lazy(() => import('./dataclass/DataClassEditor').then(module => ({ default: module.DataClassEditor })));

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
    { name: 'neo-open-editors', version: 4 }
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
  return (
    <Suspense
      fallback={
        <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
          <Spinner />
        </Flex>
      }
    >
      {(() => {
        switch (editor.type) {
          case 'processes':
            return <ProcessEditor {...editor} />;
          case 'forms':
            return <FormEditor {...editor} />;
          case 'casemaps':
            return <CaseMapEditor {...editor} />;
          case 'variables':
            return <VariableEditor {...editor} />;
          case 'roles':
            return <RoleEditor {...editor} />;
          case 'users':
            return <UserEditor {...editor} />;
          case 'persistence':
            return <PersistenceEditor {...editor} />;
          case 'restclients':
            return <RestClientEditor {...editor} />;
          case 'webservices':
            return <WebserviceEditor {...editor} />;
          case 'cms':
            return <CmsEditor {...editor} />;
          case 'databases':
            return <DatabaseEditor {...editor} />;
          case 'dataclasses':
            return <DataClassEditor {...editor} />;
          default:
            noUnknownType(editor.type);
            return null;
        }
      })()}
    </Suspense>
  );
};
