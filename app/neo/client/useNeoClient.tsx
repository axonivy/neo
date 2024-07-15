import { urlBuilder } from '@axonivy/jsonrpc/lib/connection-util';
import { useLocation, useNavigate } from '@remix-run/react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
import { NeoClientJsonRpc } from '~/data/neo-jsonrpc';
import { NeoClient } from '~/data/neo-protocol';
import { useWorkspace } from '~/data/workspace-api';
import { wsBaseUrl } from '~/data/ws-base';
import { useCreateEditor, useEditors } from '~/neo/editors/useEditors';
import { AnimationFollowMode } from '../settings/useSettings';

type NeoClientProviderState = {
  client: React.MutableRefObject<NeoClient | undefined>;
};

export const NeoClientProviderContext = createContext<NeoClientProviderState | undefined>(undefined);

export const NeoClientProvider = ({ children }: { children: React.ReactNode }) => {
  const workspace = useWorkspace();
  const client = useRef<NeoClient>();
  const connection = useRef<WebSocket>();
  useEffect(() => {
    if (!workspace) return;
    const webSocketUrl = urlBuilder(wsBaseUrl(), `${workspace.baseUrl}/ivy-neo-lsp`);
    const webSocket = new WebSocket(webSocketUrl);
    webSocket.onopen = async () => {
      const socket = toSocket(webSocket);
      const reader = new WebSocketMessageReader(socket);
      const writer = new WebSocketMessageWriter(socket);
      NeoClientJsonRpc.startClient({ reader, writer }).then(neoClient => {
        client.current = neoClient;
      });
    };
    connection.current = webSocket;
    webSocket.onerror = () => console.log('Connection could not be established.');
    return () => {
      connection.current?.close();
      client.current?.stop();
      connection.current = undefined;
    };
  }, [workspace]);
  return <NeoClientProviderContext.Provider value={{ client }}>{children}</NeoClientProviderContext.Provider>;
};

export const useNeoClient = (mode: AnimationFollowMode) => {
  const context = useContext(NeoClientProviderContext);
  const { editors, openEditor } = useEditors();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { createProcessEditor } = useCreateEditor();
  if (context === undefined) throw new Error('useNeoClient must be used within a NeoClientProvider');
  const { client } = context;
  client.current?.onOpenEditor.set(process => {
    const editor = createProcessEditor(process);
    switch (mode) {
      case 'all':
        openEditor(editor);
        return true;
      case 'currentProcess':
        return editor.id === pathname;
      case 'openProcesses':
        if (editors.find(e => e.id === editor.id)) {
          navigate(editor.id);
          return true;
        }
        return false;
      case 'noDialogProcesses':
        if (process.kind === 'HTML_DIALOG') {
          return false;
        }
        openEditor(editor);
        return true;
      case 'noEmbeddedProcesses':
        //TODO: check if embedded
        openEditor(editor);
        return true;
    }
    //TODO: wait on editor to be ready
  });
  return client.current;
};
