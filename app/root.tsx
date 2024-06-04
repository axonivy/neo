import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import iconStylesHref from '@axonivy/ui-icons/lib/ivy-icons.css?url';
import componentsStylesHref from '@axonivy/ui-components/lib/style.css?url';
import rootStylesHref from '~/styles/root.css?url';
import { LinksFunction } from '@remix-run/node';
import { Neo } from './neo/Neo';
import { ThemeProvider } from '@axonivy/ui-components';

const queryClient = new QueryClient();

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: iconStylesHref },
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
      <body>
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
        <Neo />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-right'} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
