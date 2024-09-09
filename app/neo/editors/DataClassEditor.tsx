import { DataClassEditor as App, ClientContextProvider, ClientJsonRpc } from '@axonivy/dataclass-editor';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Editor } from '~/neo/editors/useEditors';
import { useWebSocket } from './useWebSocket';

export const DataClassEditor = ({ id, project, path, name }: Editor) => {
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
