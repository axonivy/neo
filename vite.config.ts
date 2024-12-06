import { reactRouter } from '@react-router/dev/vite';
import { type ProxyOptions, defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const DESIGNER_URL = process.env.BASE_URL ?? 'http://localhost:8081/';
const WEBSOCKET_PROXY: ProxyOptions = {
  target: DESIGNER_URL,
  ws: true
};
const DEV_PROXY: ProxyOptions = {
  target: DESIGNER_URL,
  followRedirects: true
};

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths({ projects: ['tsconfig.json'] }), svgr()],
  base: '/neo/',
  server: {
    proxy: {
      '/api': {
        target: DESIGNER_URL,
        auth: 'Developer:Developer'
      },
      '^/~.*': {
        target: DESIGNER_URL,
        auth: 'Developer:Developer',
        ws: true
      },
      '/monaco-yaml-ivy': DEV_PROXY,
      '/dev-workflow-ui': DEV_PROXY,
      '/system': DEV_PROXY,
      '/designer': WEBSOCKET_PROXY,
      '/ivy-script-lsp': WEBSOCKET_PROXY,
      '/ivy-inscription-lsp': WEBSOCKET_PROXY,
      '/ivy-form-lsp': WEBSOCKET_PROXY,
      '/ivy-web-ide-lsp': WEBSOCKET_PROXY,
      '/ivy-config-lsp': WEBSOCKET_PROXY,
      '/ivy-data-class-lsp': WEBSOCKET_PROXY
    }
  },
  build: {
    target: 'es2022'
  }
});
