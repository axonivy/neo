import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  buildDirectory: 'dist',
  basename: '/neo/',
  future: {
    // This should fix an error in React Router on the first load of the dev server, which may occur when dependencies have changed.
    // https://github.com/remix-run/react-router/issues/12786#issuecomment-2634033513
    unstable_optimizeDeps: true
  }
} satisfies Config;
