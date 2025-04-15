import { toast } from '@axonivy/ui-components';
import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { NeoClientJsonRpc } from '~/data/neo-jsonrpc';
import type { NeoClient } from '~/data/neo-protocol';
import { useEditors } from '~/neo/editors/useEditors';
import type { Editor } from '../editors/editor';
import { useCreateEditor } from '../editors/useCreateEditor';
import { useWebSocket } from '../editors/useWebSocket';
import { useSettings, useSyncSettings } from '../settings/useSettings';

type NeoClientProviderState = {
  client: NeoClient | undefined;
};

export const NeoClientProviderContext = createContext<NeoClientProviderState | undefined>(undefined);

export const NeoClientProvider = ({ children }: { children: React.ReactNode }) => {
  const client = useWebSocket<NeoClientJsonRpc>(NeoClientJsonRpc.webSocketUrl, NeoClientJsonRpc.startMessageClient, {
    log: console.log,
    info: toast.info,
    warn: toast.warning,
    error: toast.error
  });
  return <NeoClientProviderContext.Provider value={{ client }}>{children}</NeoClientProviderContext.Provider>;
};

export const useNeoClient = () => {
  const { t } = useTranslation();
  const { animation } = useSettings();
  const context = useContext(NeoClientProviderContext);
  const { editors, openEditor } = useEditors();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { createProcessEditor, createFormEditor } = useCreateEditor();
  if (context === undefined) throw new Error('useNeoClient must be used within a NeoClientProvider');
  const { client } = context;
  useSyncSettings(client);
  client?.onOpenProcessEditor.set(async process => {
    const editor = createProcessEditor(process);
    switch (animation.mode) {
      case 'all':
        openEditor(editor);
        await waitUntilPathnameMatches(editor);
        return true;
      case 'currentProcess':
        return editor.id === pathname;
      case 'openProcesses':
        if (editors.find(e => e.id === editor.id)) {
          navigate(editor.id);
          await waitUntilPathnameMatches(editor);
          return true;
        }
        return false;
      case 'noDialogProcesses':
        if (process.kind === 'HTML_DIALOG') {
          return false;
        }
        openEditor(editor);
        await waitUntilPathnameMatches(editor);
        return true;
      case 'noEmbeddedProcesses':
        openEditor(editor);
        await waitUntilPathnameMatches(editor);
        return true;
    }
  });
  client?.onOpenFormEditor.set(async form => {
    if (form.type !== 'Form') {
      toast.error(t('toast.editor.unknownType'), { description: t('toast.editor.unknownTypeForType', { type: form.type }) });
      return false;
    }
    const editor = createFormEditor(form);
    openEditor(editor);
    return true;
  });
  return client;
};

const waitUntilPathnameMatches = ({ id }: Editor) => {
  return new Promise<void>(resolve => {
    const interval = setInterval(() => {
      if (!window.location.pathname.endsWith(id)) return;
      clearInterval(interval);
      resolve();
    }, 100);
  });
};
