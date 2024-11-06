import { ReadonlyProvider } from '@axonivy/ui-components';
import { VariableEditor as App, ClientContextProvider } from '@axonivy/variable-editor';
import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import type { Editor } from '../editor';
import { useWebSocket } from '../useWebSocket';
import { useActionHandler } from './useActionHandler';
import { VariableClientNeo } from './variable-client';

export const VariableEditor = ({ id, project, name }: Editor) => {
  const actionHandler = useActionHandler();
  const client = useWebSocket<VariableClientNeo>(id, VariableClientNeo.webSocketUrl, connection =>
    VariableClientNeo.startNeoMessageClient(connection, actionHandler)
  );
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
              <App context={{ app: project.app, pmv: project.pmv, file: 'config/variables.yaml' }} directSave={true} />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
