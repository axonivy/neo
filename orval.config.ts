import { defineConfig } from 'orval';

const hooks = { afterAllFilesWrite: 'prettier --write' };
const filters = { tags: ['web-ide'] };
const client = 'fetch';

export default defineConfig({
  openapiDev: {
    input: {
      target: './openapi-dev.yaml',
      filters
    },
    output: {
      target: './app/data/generated/openapi-dev.ts',
      client,
      override: {
        mutator: {
          path: './app/data/custom-fetch.ts',
          name: 'customFetch'
        }
      }
    },
    hooks
  }
});
