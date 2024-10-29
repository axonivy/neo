import { Flex, Spinner, ThemeProvider } from '@axonivy/ui-components';
import componentsStylesHref from '@axonivy/ui-components/lib/style.css?url';
import iconStylesHref from '@axonivy/ui-icons/lib/ivy-icons.css?url';
import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import rootStylesHref from '~/styles/root.css?url';
import { NewArtifactDialogProvider } from './neo/artifact/useNewArtifact';
import { WebBrowserProvider } from './neo/browser/useWebBrowser';
import { Neo } from './neo/Neo';

const queryClient = new QueryClient();

export const links: LinksFunction = () => [
  { rel: 'preload stylesheet', href: iconStylesHref, as: 'style' },
  { rel: 'stylesheet', href: componentsStylesHref },
  { rel: 'stylesheet', href: rootStylesHref }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body style={{ overflow: 'hidden' }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider storageKey='neo-editor-theme'>
      <QueryClientProvider client={queryClient}>
        <WebBrowserProvider>
          <NewArtifactDialogProvider>
            <Neo />
          </NewArtifactDialogProvider>
        </WebBrowserProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-right'} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export function HydrateFallback() {
  return (
    <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
      <Spinner />
    </Flex>
  );
}
