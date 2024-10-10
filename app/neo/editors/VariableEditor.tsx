import { ReadonlyProvider } from '@axonivy/ui-components';
import { VariableEditor as App, ClientContextProvider, ClientJsonRpc } from '@axonivy/variable-editor';
import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import type { Editor } from './editor';
import { useWebSocket } from './useWebSocket';

export const VariableEditor = ({ id, project, name }: Editor) => {
  const client = useWebSocket<ClientJsonRpc>(id, ClientJsonRpc.webSocketUrl, ClientJsonRpc.startMessageClient);
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
    }
  }, [pathname, id]);

  return (
    <>
      {mounted && client && (
        <div data-editor-name={name} className='variable-editor' style={{ display: pathname !== id ? 'none' : undefined }}>
          <ClientContextProvider client={client}>
            <ReadonlyProvider readonly={project.isIar ?? false}>
              <App context={{ app: project.app, pmv: project.pmv, file: 'variables.yaml' }} directSave={true} />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
