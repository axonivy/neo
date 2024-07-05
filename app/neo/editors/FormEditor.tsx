import { useEffect, useState } from 'react';
import { Editor } from '~/neo/editors/useEditors';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { FormClient } from '@axonivy/form-editor-protocol';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { App, ClientContextProvider } from '@axonivy/form-editor';
import { useLocation } from '@remix-run/react';
import { wsBaseUrl } from '~/data/ws-base';
import { useWorkspace } from '~/data/workspace-api';

export const FormEditor = ({ id, project, path }: Editor) => {
  const [client, setClient] = useState<FormClient>();
  const ws = useWorkspace();
  useEffect(() => {
    FormClientJsonRpc.startWebSocketClient(`${wsBaseUrl()}${ws?.baseUrl}`).then(formClient => setClient(formClient));
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
        <div style={{ display: pathname !== id ? 'none' : undefined }}>
          <ClientContextProvider client={client}>
            <ReadonlyProvider readonly={false}>
              <App
                context={{ app: project.app, pmv: project.pmv, file: path.endsWith('.f.json') ? path : `${path}.f.json` }}
                directSave={true}
              />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
