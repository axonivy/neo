import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { App, ClientContextProvider } from '@axonivy/webservice-editor';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Editor } from '~/neo/editors/editor';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import { useActionHandler } from './useActionHandler';
import { WebserviceClientNeo } from './webservice-client';

export const WebserviceEditor = ({ project }: Editor) => {
  const actionHandler = useActionHandler();
  const client = useWebSocket<WebserviceClientNeo>(WebserviceClientNeo.webSocketUrl, connection =>
    WebserviceClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <I18nextProvider i18n={i18next} defaultNS={'webservice-editor'}>
            <App context={{ app: project.app, pmv: project.pmv, file: 'config/webservice-clients.yaml' }} directSave={true} />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
