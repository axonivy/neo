import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { App, ClientContextProvider } from '@axonivy/user-editor';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Editor } from '~/neo/editors/editor';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import { useActionHandler } from './useActionHandler';
import { UserClientNeo } from './user-client';

export const UserEditor = ({ project }: Editor) => {
  const actionHandler = useActionHandler();
  const client = useWebSocket<UserClientNeo>(UserClientNeo.webSocketUrl, connection =>
    UserClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <I18nextProvider i18n={i18next} defaultNS={'user-editor'}>
            <App context={{ app: project.app, pmv: project.pmv, file: 'config/users.yaml' }} directSave={true} />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
