import { DataClassEditor as App, ClientContextProvider, ClientJsonRpc } from '@axonivy/dataclass-editor';
import { Client } from '@axonivy/dataclass-editor/lib/protocol/types';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useWorkspace } from '~/data/workspace-api';
import { wsBaseUrl } from '~/data/ws-base';
import { Editor } from '~/neo/editors/useEditors';

export const DataClassEditor = ({ id, project, path, name }: Editor) => {
  const [client, setClient] = useState<Client>();
  const ws = useWorkspace();
  useEffect(() => {
    ClientJsonRpc.startWebSocketClient(`${wsBaseUrl()}${ws?.baseUrl}`).then(dcClient => setClient(dcClient));
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
        <div
          data-editor-name={name}
          className='data-class-editor'
          style={{ height: '100%', display: pathname !== id ? 'none' : undefined }}
        >
          <ClientContextProvider client={client}>
            <ReadonlyProvider readonly={false}>
              <App context={{ app: project.app, pmv: project.pmv, file: path }} directSave={true} />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
