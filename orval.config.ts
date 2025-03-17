import { defineConfig } from 'orval';

const client = 'fetch';
const override = {
  mutator: {
    path: './app/data/custom-fetch.ts',
    name: 'customFetch'
  }
};

export default defineConfig({
  openapiIvy: {
    input: {
      target: 'target/engine/openapi.json',
      filters: { tags: ['web-ide', 'engine'] }
    },
    output: {
      target: './app/data/generated/ivy-client.ts',
      client,
      prettier: true,
      override
    }
  },
  openapiMarket: {
    input: {
      target: 'target/market/openapi.json'
    },
    output: {
      target: './app/data/generated/market-client.ts',
      client,
      prettier: true,
      override
    }
  }
});
