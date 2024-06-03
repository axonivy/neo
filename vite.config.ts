import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

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
    tsconfigPaths(),
    svgr()
  ],
  base: '/neo/',
  server: {
    proxy: {
      '/neo/api': {
        target: 'http://localhost:8081/',
        rewrite: path => path.replace(/^\/neo/, ''),
        auth: 'Developer:Developer'
      }
    }
  }
});
