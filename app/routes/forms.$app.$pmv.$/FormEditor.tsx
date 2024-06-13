import { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';
import { Editor } from '~/neo/useEditors';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { FormClient } from '@axonivy/form-editor-protocol';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';

export const FormEditor = ({ id, app, pmv, path }: Editor) => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
    }
  }, [pathname, id]);
  const queryClient = initQueryClient();
  const [client, setClient] = useState<FormClient>();

  useEffect(() => {
    FormClientJsonRpc.startWebSocketClient('localhost:8081').then(c => setClient(c));
  });

  return (
    <>
      {mounted && client && (
        <ClientContextProvider client={client}>
          <QueryProvider client={queryClient}>
            <ReadonlyProvider readonly={false}>
              <App app={app} pmv={pmv} file={path} />
            </ReadonlyProvider>
          </QueryProvider>
        </ClientContextProvider>
      )}
    </>
  );
};
