import monacoConfigPlugin from '@axonivy/monaco-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [monacoConfigPlugin()],
  build: {
    manifest: 'build.manifest.json',
    outDir: '../../public/process-editor',
    chunkSizeWarningLimit: 5000
  },
  css: {
    lightningcss: {
      errorRecovery: true
    }
  },
  base: './'
}));
