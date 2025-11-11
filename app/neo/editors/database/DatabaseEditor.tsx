import { ClientContextProvider, DatabaseEditor as DbEditor } from '@axonivy/database-editor';
import { ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { useSortedProjects } from '~/data/project-api';
import { useWorkspace } from '~/data/workspace-api';
import { DatabaseClientNeo } from '~/neo/editors/database/database-client';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import type { Editor } from '../editor';

export const DatabaseEditor = ({ path }: Editor) => {
  const ws = useWorkspace();
  const app = ws?.baseUrl.substring(2) ?? 'invalid';
  const allProjects = useSortedProjects().data?.map(p => p.id.pmv) ?? [];
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
          <DbEditor context={{ app: app, file: path, projects: allProjects }} />
        </I18nextProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
