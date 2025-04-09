import { App, ClientContextProvider } from '@axonivy/log-view';
import viewStylesHref from '@axonivy/log-view/lib/view.css?url';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
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
    return null;
  }
  return (
    <ClientContextProvider client={client}>
      <ThemeProvider disabled>
        <ReadonlyProvider readonly={false}>
          <App />
        </ReadonlyProvider>
      </ThemeProvider>
    </ClientContextProvider>
  );
}
