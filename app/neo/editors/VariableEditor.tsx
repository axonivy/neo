import { useEffect, useState } from 'react';
import { Editor } from '~/neo/editors/useEditors';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { useLocation } from '@remix-run/react';
import { ClientContextProvider, ClientJsonRpc, VariableEditor as App } from '@axonivy/variable-editor';
import { Client } from '@axonivy/variable-editor/lib/protocol/types';
import { wsBaseUrl } from '~/data/ws-base';

export const VariableEditor = ({ id, project }: Editor) => {
  const [client, setClient] = useState<Client>();
  useEffect(() => {
    ClientJsonRpc.startWebSocketClient(wsBaseUrl()).then(client => setClient(client));
  }, [id]);
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
        <div style={{ display: pathname !== id ? 'none' : undefined }}>
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
