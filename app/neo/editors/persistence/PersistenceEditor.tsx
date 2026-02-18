import { App, ClientContextProvider } from '@axonivy/persistence-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Editor } from '~/neo/editors/editor';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import { PersistenceClientNeo } from './persistence-client';
import { useActionHandler } from './useActionHandler';

export const PersistenceEditor = ({ project }: Editor) => {
  const actionHandler = useActionHandler();
  const client = useWebSocket<PersistenceClientNeo>(PersistenceClientNeo.webSocketUrl, connection =>
    PersistenceClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <I18nextProvider i18n={i18next} defaultNS={'persistence-editor'}>
            <App context={{ app: project.app, pmv: project.pmv, file: 'config/persistence.xml' }} directSave={true} />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
