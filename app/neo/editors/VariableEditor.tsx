import { ReadonlyProvider } from '@axonivy/ui-components';
import { VariableEditor as App, ClientContextProvider, ClientJsonRpc } from '@axonivy/variable-editor';
import { Client } from '@axonivy/variable-editor/lib/protocol/types';
import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useWorkspace } from '~/data/workspace-api';
import { wsBaseUrl } from '~/data/ws-base';
import { Editor } from '~/neo/editors/useEditors';

export const VariableEditor = ({ id, project, name }: Editor) => {
  const [client, setClient] = useState<Client>();
  const ws = useWorkspace();
  useEffect(() => {
    ClientJsonRpc.startWebSocketClient(`${wsBaseUrl()}${ws?.baseUrl}`).then(client => setClient(client));
  }, [id, ws?.baseUrl]);
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
            <ReadonlyProvider readonly={false}>
              <App context={{ app: project.app, pmv: project.pmv, file: 'variables.yaml' }} directSave={true} />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
