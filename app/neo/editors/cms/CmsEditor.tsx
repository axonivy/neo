import { CmsEditor as App, ClientContextProvider } from '@axonivy/cms-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import type { Editor } from '../editor';
import { useWebSocket } from '../useWebSocket';
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
          <App context={{ app: project.app, pmv: project.pmv }} />
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
