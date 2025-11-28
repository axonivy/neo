import monacoConfigPlugin from '@axonivy/monaco-vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  const config = {
    plugins: [tsconfigPaths({ projects: ['tsconfig.json'] }), monacoConfigPlugin()],
    build: {
      manifest: 'build.manifest.json',
      outDir: '../../public/process-editor',
      chunkSizeWarningLimit: 5000
    },
    base: './'
  };
  return config;
});
