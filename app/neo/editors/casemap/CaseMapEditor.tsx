import { CaseMapEditor as App, ClientContextProvider } from '@axonivy/case-map-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { CASEMAP_EDITOR_SUFFIX, type Editor } from '~/neo/editors/editor';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import { CaseMapClientNeo } from './casemap-client';
import { useActionHandler } from './useActionHandler';

export const CaseMapEditor = ({ project, path }: Editor) => {
  const actionHandler = useActionHandler();
  const client = useWebSocket<CaseMapClientNeo>(CaseMapClientNeo.webSocketUrl, connection =>
    CaseMapClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <I18nextProvider i18n={i18next} defaultNS={'casemap-editor'}>
            <App
              context={{
                app: project.app,
                pmv: project.pmv,
                file: path.endsWith(CASEMAP_EDITOR_SUFFIX) ? path : `${path}${CASEMAP_EDITOR_SUFFIX}`
              }}
              directSave={true}
            />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
