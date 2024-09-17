import { App, ClientContextProvider } from '@axonivy/form-editor';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Editor } from '~/neo/editors/useEditors';
import { useWebSocket } from './useWebSocket';

export const FormEditor = ({ id, project, path, name }: Editor) => {
  const client = useWebSocket<FormClientJsonRpc>(id, FormClientJsonRpc.webSocketUrl, FormClientJsonRpc.startMessageClient);
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
        <div data-editor-name={name} className='form-editor' style={{ height: '100%', display: pathname !== id ? 'none' : undefined }}>
          <ClientContextProvider client={client}>
            <ReadonlyProvider readonly={project.isIar ?? false}>
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
