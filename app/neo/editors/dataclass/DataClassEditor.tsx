import { DataClassEditor as App, ClientContextProvider } from '@axonivy/dataclass-editor';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Editor } from '~/neo/editors/useEditors';
import { useWebSocket } from '../useWebSocket';
import { DataClassClientNeo } from './data-class-client';
import { useActionHandler } from './useActionHandler';

export const DataClassEditor = ({ id, project, path, name }: Editor) => {
  const actionHandler = useActionHandler(project, path);
  const client = useWebSocket<DataClassClientNeo>(id, DataClassClientNeo.webSocketUrl, connection =>
    DataClassClientNeo.startNeoMessageClient(connection, actionHandler)
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
        <div
          data-editor-name={name}
          className='data-class-editor'
          style={{ height: '100%', display: pathname !== id ? 'none' : undefined }}
        >
          <ClientContextProvider client={client}>
            <ReadonlyProvider readonly={project.isIar ?? false}>
              <App
                context={{ app: project.app, pmv: project.pmv, file: path.endsWith('.d.json') ? path : `${path}.d.json` }}
                directSave={true}
              />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
