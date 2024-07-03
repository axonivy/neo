import { createContext, useContext } from 'react';
import { createProcessEditor, useEditors } from '~/neo/editors/useEditors';
import { useLocation, useNavigate } from '@remix-run/react';
import { AnimationFollowMode } from '../settings/useSettings';
import { NeoClient } from '~/data/neo-protocol';

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
  client.onOpenEditor.set(process => {
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
