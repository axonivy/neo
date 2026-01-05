import { reactRouter } from '@react-router/dev/vite';
import crypto from 'crypto';
import { type ProxyOptions, defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';

const buildHash = `${packageJson.version}-${crypto.randomBytes(4).toString('hex')}`;
const ENGINE_URL = process.env.BASE_URL ?? 'http://localhost:8080/';
const WEBSOCKET_PROXY: ProxyOptions = {
  target: ENGINE_URL,
  ws: true
};
const DEV_PROXY: ProxyOptions = {
  target: ENGINE_URL,
  followRedirects: true,
  changeOrigin: true
};

export default defineConfig({
  plugins: [
    compression({
      algorithms: ['brotli']
    }),
    reactRouter(),
    tsconfigPaths({ projects: ['tsconfig.json'] })
  ],
  define: {
    __VERSION__: JSON.stringify(buildHash)
  },
  base: '/neo/',
  server: {
    proxy: {
      '/api': {
        target: ENGINE_URL,
        auth: 'Developer:Developer'
      },
      '^/~.*': {
        target: ENGINE_URL,
        auth: 'Developer:Developer',
        ws: true
      },
      '/go': DEV_PROXY,
      '/demo-portal': DEV_PROXY,
      '/monaco-yaml-ivy': DEV_PROXY,
      '/dev-workflow-ui': DEV_PROXY,
      '/system': DEV_PROXY,
      '/webjars': DEV_PROXY,
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
