import { App, ClientContextProvider } from '@axonivy/form-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { type Editor, FORM_EDITOR_SUFFIX } from '../editor';
import { useWebSocket } from '../useWebSocket';
import { FormClientNeo } from './form-client';
import { useActionHandler } from './useActionHandler';

export const FormEditor = ({ project, path }: Editor) => {
  const actionHandler = useActionHandler(project, path);
  const client = useWebSocket<FormClientNeo>(FormClientNeo.webSocketUrl, connection =>
    FormClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
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
  );
};
