import { App, ClientContextProvider } from '@axonivy/log-view';
import { Spinner, ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { useWebSocket } from '~/neo/editors/useWebSocket';
import { RuntimeLogClientNeo } from './runtime-log-client';

export const RuntimeLog = () => {
  const client = useWebSocket<RuntimeLogClientNeo>(RuntimeLogClientNeo.webSocketUrl, connection =>
    RuntimeLogClientNeo.startNeoMessageClient(connection)
  );
  if (!client) {
    return <Spinner style={{ marginLeft: '50%', marginTop: '10%' }} size='large' />;
  }
  return (
    <div className='runtime-log' style={{ height: '100%' }}>
      <ClientContextProvider client={client}>
        <ThemeProvider disabled>
          <I18nextProvider i18n={i18next} defaultNS={'log-view'}>
            <App />
          </I18nextProvider>
        </ThemeProvider>
      </ClientContextProvider>
    </div>
  );
};
