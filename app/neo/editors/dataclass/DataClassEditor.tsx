import { DataClassEditor as App, ClientContextProvider } from '@axonivy/dataclass-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { type Editor, DATACLASS_EDITOR_SUFFIX } from '../editor';
import { useWebSocket } from '../useWebSocket';
import { DataClassClientNeo } from './data-class-client';
import { useActionHandler } from './useActionHandler';

export const DataClassEditor = ({ project, path }: Editor) => {
  const actionHandler = useActionHandler(project, path);
  const client = useWebSocket<DataClassClientNeo>(DataClassClientNeo.webSocketUrl, connection =>
    DataClassClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <I18nextProvider i18n={i18next} defaultNS={'dataclass-editor'}>
            <App
              context={{
                app: project.app,
                pmv: project.pmv,
                file: path.endsWith(DATACLASS_EDITOR_SUFFIX) ? path : `${path}${DATACLASS_EDITOR_SUFFIX}`
              }}
              directSave={true}
            />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
