import { useEffect, useState } from 'react';
import { Editor } from '~/neo/useEditors';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { FormClient } from '@axonivy/form-editor-protocol';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { App, ClientContextProvider } from '@axonivy/form-editor';
import { useLocation } from '@remix-run/react';

const wsBase = () => window.location.origin.replace('https://', 'wss://').replace('http://', 'ws://');

export const FormEditor = ({ id, projectIdentifier, path }: Editor) => {
  const [client, setClient] = useState<FormClient>();
  useEffect(() => {
    FormClientJsonRpc.startWebSocketClient(wsBase()).then(formClient => setClient(formClient));
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
              <App app={projectIdentifier.app} pmv={projectIdentifier.pmv} file={path} />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
