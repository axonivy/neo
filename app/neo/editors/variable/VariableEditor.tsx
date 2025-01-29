import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { VariableEditor as App, ClientContextProvider } from '@axonivy/variable-editor';
import type { Editor } from '../editor';
import { useWebSocket } from '../useWebSocket';
import { useActionHandler } from './useActionHandler';
import { VariableClientNeo } from './variable-client';

export const VariableEditor = ({ project }: Editor) => {
  const actionHandler = useActionHandler();
  const client = useWebSocket<VariableClientNeo>(VariableClientNeo.webSocketUrl, connection =>
    VariableClientNeo.startNeoMessageClient(connection, actionHandler)
  );
  if (!client) {
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={project.isIar ?? false}>
          <App context={{ app: project.app, pmv: project.pmv, file: 'config/variables.yaml' }} directSave={true} />
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
