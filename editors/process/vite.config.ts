import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  const config = {
    plugins: [tsconfigPaths({ projects: ['tsconfig.json'] })],
    build: {
      manifest: 'build.manifest.json',
      outDir: '../../public/process-editor',
      chunkSizeWarningLimit: 5000,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('monaco-languageclient' || id.includes('vscode'))) {
              return 'monaco-chunk';
            }
          }
        }
      }
    },
    base: './',
    optimizeDeps: {
      needsInterop: [
        'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js',
        'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js'
      ]
    }
  };
  return config;
});
