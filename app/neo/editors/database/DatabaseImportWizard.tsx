import { ClientContextProvider, ImportWizard } from '@axonivy/database-editor';
import { Button, ThemeProvider } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useDataClassesApi } from '~/data/data-class-api';
import { useSortedProjects } from '~/data/project-api';
import { useWorkspace } from '~/data/workspace-api';
import { DatabaseClientNeo } from '~/neo/editors/database/database-client';
import { useWebSocket } from '~/neo/editors/useWebSocket';

export const DatabaseImportWizard = () => {
  const ws = useWorkspace();
  const app = ws?.baseUrl.substring(2) ?? 'invalid';
  const allProjects = useSortedProjects().data?.map(p => p.id.pmv) ?? [];
  const { t } = useTranslation();
  const client = useWebSocket<DatabaseClientNeo>(DatabaseClientNeo.webSocketUrl, connection =>
    DatabaseClientNeo.startNeoMessageClient(connection)
  );
  const { queryKey } = useDataClassesApi();
  const queryClient = useQueryClient();
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <I18nextProvider i18n={i18next} defaultNS={'database-editor'}>
          <ImportWizard
            context={{ app: app, file: 'config/databases.yaml', projects: allProjects }}
            callback={() => queryClient.invalidateQueries({ queryKey })}
          >
            <Button
              title={t('dataClass.importWizard')}
              icon={IvyIcons.Download}
              size='xl'
              variant='primary-outline'
              aria-label={t('dataClass.importWizard')}
              style={{ whiteSpace: 'nowrap' }}
            >
              {t('dataClass.importWizard')}
            </Button>
          </ImportWizard>
        </I18nextProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
