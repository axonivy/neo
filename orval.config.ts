import { defineConfig } from 'orval';

const hooks = { afterAllFilesWrite: 'prettier --write' };
const filters = { tags: ['web-ide'] };
const client = 'fetch';
const override = {
  mutator: {
    path: './app/data/custom-fetch.ts',
    name: 'customFetch'
  }
};

export default defineConfig({
  openapiDev: {
    input: {
      target: './openapi-dev.yaml',
      filters
    },
    output: {
      target: './app/data/generated/openapi-dev.ts',
      client,
      override
    },
    hooks
  },
  openapiDefault: {
    input: {
      target: './openapi-default.yaml',
      filters
    },
    output: {
      target: './app/data/generated/openapi-default.ts',
      client,
      override
    },
    hooks
  }
});
