import { vitePlugin as remix } from '@remix-run/dev';
import { ProxyOptions, defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

const DESIGNER_URL = 'http://localhost:8081/';
const WEBSOCKET_PROXY: ProxyOptions = {
  target: DESIGNER_URL,
  ws: true
};
const DEV_PROXY: ProxyOptions = {
  target: DESIGNER_URL,
  followRedirects: true
};

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      },
      buildDirectory: 'dist',
      basename: '/neo/'
    }),
    tsconfigPaths({ projects: ['tsconfig.json'] }),
    svgr()
  ],
  base: '/neo/',
  server: {
    proxy: {
      '/api': {
        target: DESIGNER_URL,
        auth: 'Developer:Developer'
      },
      '^/ivy-dev-.*': {
        target: DESIGNER_URL,
        auth: 'Developer:Developer',
        ws: true
      },
      '/dev-workflow-ui': DEV_PROXY,
      '/system': DEV_PROXY,
      '/designer': WEBSOCKET_PROXY,
      '/ivy-script-lsp': WEBSOCKET_PROXY,
      '/ivy-inscription-lsp': WEBSOCKET_PROXY,
      '/ivy-form-lsp': WEBSOCKET_PROXY,
      '/ivy-neo-lsp': WEBSOCKET_PROXY,
      '/ivy-config-lsp': WEBSOCKET_PROXY
    }
  },
  build: {
    target: 'es2022'
  }
});
