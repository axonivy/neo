import { App, ClientContextProvider } from '@axonivy/form-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
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
          <I18nextProvider i18n={i18next} defaultNS={'form-editor'}>
            <App
              context={{
                app: project.app,
                pmv: project.pmv,
                file: path.endsWith(FORM_EDITOR_SUFFIX) ? path : `${path}${FORM_EDITOR_SUFFIX}`
              }}
              directSave={true}
            />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
