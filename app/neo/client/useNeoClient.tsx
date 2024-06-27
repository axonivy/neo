import { createContext, useContext } from 'react';
import { NeoClient } from '~/data/neo-jsonrpc';
import { Editor, editorIcon, editorId, useEditors } from '../useEditors';
import { useLocation, useNavigate } from '@remix-run/react';
import { AnimationFollowMode } from '../settings/useSettings';

type NeoClientProviderState = {
  client: NeoClient;
};

const NeoClientProviderContext = createContext<NeoClientProviderState | undefined>(undefined);

export const NeoClientProvider = ({ children, ...context }: NeoClientProviderState & { children: React.ReactNode }) => {
  return <NeoClientProviderContext.Provider value={context}>{children}</NeoClientProviderContext.Provider>;
};

export const useNeoClient = (mode: AnimationFollowMode) => {
  const context = useContext(NeoClientProviderContext);
  const { editors, openEditor } = useEditors();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (context === undefined) throw new Error('useNeoClient must be used within a NeoClientProvider');
  const { client } = context;
  client.onOpenEditor.set(({ name, path, processIdentifier, ...process }) => {
    let id = '';
    let editor: Editor;
    if (process.kind === 3) {
      const path = `${process.namespace}/${name}`;
      id = editorId('src_hd', processIdentifier.project, path);
      editor = { id, type: 'src_hd', icon: editorIcon('processes'), name, project: processIdentifier.project, path };
    } else {
      id = editorId('processes', processIdentifier.project, path);
      editor = { id, type: 'processes', icon: editorIcon('processes'), name, project: processIdentifier.project, path };
    }
    switch (mode) {
      case 'all':
        openEditor(editor);
        return true;
      case 'currentProcess':
        return id === pathname;
      case 'openProcesses':
        if (editors.find(e => e.id === id)) {
          navigate(id);
          return true;
        }
        return false;
      case 'noDialogProcesses':
        if (process.kind === 3) {
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
  return client;
};
