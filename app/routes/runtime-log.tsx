import { App, ClientContextProvider } from '@axonivy/log-view';
import viewStylesHref from '@axonivy/log-view/lib/view.css?url';
import { Spinner, ThemeProvider } from '@axonivy/ui-components';
import type { LinksFunction, MetaFunction } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { RuntimeLogClientNeo } from '../neo/editors/runtime-log-client';
import { useWebSocket } from '../neo/editors/useWebSocket';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: viewStylesHref }];

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Runtime Log - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: 'Runtime Log View' }];
};

export default function Index() {
  const client = useWebSocket<RuntimeLogClientNeo>(RuntimeLogClientNeo.webSocketUrl, connection =>
    RuntimeLogClientNeo.startNeoMessageClient(connection)
  );
  if (!client) {
    return <Spinner style={{ marginLeft: '50%', marginTop: '10%' }} size='large' />;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <App />
      </ThemeProvider>
    </ClientContextProvider>
  );
}
