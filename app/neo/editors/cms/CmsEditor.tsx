import { CmsEditor as App, ClientContextProvider } from '@axonivy/cms-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Editor } from '~/neo/editors/editor';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import { CmsClientNeo } from './cms-client';
import { useActionHandler } from './useActionHandler';

export const CmsEditor = ({ project }: Editor) => {
  const actionHandler = useActionHandler();
  const client = useWebSocket<CmsClientNeo>(CmsClientNeo.webSocketUrl, connection =>
    CmsClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <I18nextProvider i18n={i18next} defaultNS={'cms-editor'}>
            <App context={{ app: project.app, pmv: project.pmv, file: 'cms' }} />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
