import { createContext, useContext } from 'react';
import { NeoClient } from '~/data/neo-jsonrpc';
import { editorIcon, editorId, useEditors } from '../useEditors';

type NeoClientProviderState = {
  client: NeoClient;
};

const NeoClientProviderContext = createContext<NeoClientProviderState | undefined>(undefined);

export const NeoClientProvider = ({ children, ...context }: NeoClientProviderState & { children: React.ReactNode }) => {
  return <NeoClientProviderContext.Provider value={context}>{children}</NeoClientProviderContext.Provider>;
};

export const useNeoClient = () => {
  const context = useContext(NeoClientProviderContext);
  const { openEditor } = useEditors();
  if (context === undefined) throw new Error('useNeoClient must be used within a NeoClientProvider');
  const { client } = context;
  client.onOpenEditor.set(({ name, path, processIdentifier }) => {
    const id = editorId('processes', processIdentifier.project, path);
    openEditor({ id, type: 'processes', icon: editorIcon('processes'), name, project: processIdentifier.project, path });
    //TODO: wait on editor to be ready
  });
  return client;
};
