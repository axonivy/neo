import { DataClassEditor as App, ClientContextProvider } from '@axonivy/dataclass-editor';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { type Editor, DATACLASS_EDITOR_SUFFIX } from '../editor';
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
                context={{
                  app: project.app,
                  pmv: project.pmv,
                  file: path.endsWith(DATACLASS_EDITOR_SUFFIX) ? path : `${path}${DATACLASS_EDITOR_SUFFIX}`
                }}
                directSave={true}
              />
            </ReadonlyProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
