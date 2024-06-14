import { useEffect, useState } from 'react';
import { Editor } from '~/neo/useEditors';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { FormClient } from '@axonivy/form-editor-protocol';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';
import { useLocation } from '@remix-run/react';

const wsBase = () => window.location.origin.replace('https://', 'wss://').replace('http://', 'ws://');

export const FormEditor = ({ id, app, pmv, path }: Editor) => {
  const queryClient = initQueryClient();
  const [client, setClient] = useState<FormClient>();
  useEffect(() => {
    FormClientJsonRpc.startWebSocketClient(wsBase()).then(formClient => setClient(formClient));
  }, [id]);
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
    } else {
      setMounted(false);
    }
  }, [pathname, id]);

  return (
    <>
      {mounted && client && (
        <ClientContextProvider client={client}>
          <QueryProvider client={queryClient}>
            <ReadonlyProvider readonly={false}>
              <App app={app} pmv={pmv} file={path.split('src_hd')[1]} />
            </ReadonlyProvider>
          </QueryProvider>
        </ClientContextProvider>
      )}
    </>
  );
};
