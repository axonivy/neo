import { ClientContextProvider, DatabaseEditor as DbEditor } from '@axonivy/database-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { DatabaseClientNeo } from '~/neo/editors/database/database-client';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import type { Editor } from '../editor';

export const DatabaseEditor = ({ project }: Editor) => {
  const client = useWebSocket<DatabaseClientNeo>(DatabaseClientNeo.webSocketUrl, connection =>
    DatabaseClientNeo.startNeoMessageClient(connection)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <I18nextProvider i18n={i18next} defaultNS={'database-editor'}>
          <ReadonlyProvider readonly={project.isIar ?? false}>
            <DbEditor context={{ app: project.app, file: 'config/databases.yaml', projects: [project.pmv] }} />
          </ReadonlyProvider>
        </I18nextProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
