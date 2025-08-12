import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { VariableEditor as App, ClientContextProvider } from '@axonivy/variable-editor';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Editor } from '~/neo/editors/editor';
import { useWebSocket } from '~/neo/editors/useWebSocket';
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
          <I18nextProvider i18n={i18next} defaultNS={'variable-editor'}>
            <App context={{ app: project.app, pmv: project.pmv, file: 'config/variables.yaml' }} directSave={true} />
          </I18nextProvider>
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
};
