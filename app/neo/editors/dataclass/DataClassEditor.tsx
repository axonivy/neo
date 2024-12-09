import { DataClassEditor as App, ClientContextProvider } from '@axonivy/dataclass-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { type Editor, DATACLASS_EDITOR_SUFFIX } from '../editor';
import { useWebSocket } from '../useWebSocket';
import { DataClassClientNeo } from './data-class-client';
import { useActionHandler } from './useActionHandler';

export const DataClassEditor = ({ id, project, path }: Editor) => {
  const actionHandler = useActionHandler(project, path);
  const client = useWebSocket<DataClassClientNeo>(id, DataClassClientNeo.webSocketUrl, connection =>
    DataClassClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <App
            context={{
              app: project.app,
              pmv: project.pmv,
              file: path.endsWith(DATACLASS_EDITOR_SUFFIX) ? path : `${path}${DATACLASS_EDITOR_SUFFIX}`
            }}
            directSave={true}
          />
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
