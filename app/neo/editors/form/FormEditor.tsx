import { App, ClientContextProvider } from '@axonivy/form-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { type Editor, FORM_EDITOR_SUFFIX } from '../editor';
import { useWebSocket } from '../useWebSocket';
import { FormClientNeo } from './form-client';
import { useActionHandler } from './useActionHandler';

export const FormEditor = ({ id, project, path, name }: Editor) => {
  const actionHandler = useActionHandler(project, path);
  const client = useWebSocket<FormClientNeo>(id, FormClientNeo.webSocketUrl, connection =>
    FormClientNeo.startNeoMessageClient(connection, actionHandler)
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
        <div data-editor-name={name} className='form-editor' style={{ height: '100%', display: pathname !== id ? 'none' : undefined }}>
          <ClientContextProvider client={client}>
            <ThemeProvider disabled>
              <ReadonlyProvider readonly={project.isIar ?? false}>
                <App
                  context={{
                    app: project.app,
                    pmv: project.pmv,
                    file: path.endsWith(FORM_EDITOR_SUFFIX) ? path : `${path}${FORM_EDITOR_SUFFIX}`
                  }}
                  directSave={true}
                />
              </ReadonlyProvider>
            </ThemeProvider>
          </ClientContextProvider>
        </div>
      )}
    </>
  );
};
