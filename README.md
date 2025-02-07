# Axon Ivy NEO Designer

This repo contains the beta version of the Axon Ivy low-code Designer called Axon Ivy NEO Designer.
It uses Remix in SPA mode for the UI.

## Setup

```shellscript
npm i
```

## Development

Start an Axon Ivy Engine (on port 8080, you could use the provided Docker compose service) and hit F5 to launch or run:

```shellscript
npm run dev
```

### Playwright Tests

The easiest way to get started is to run the Docker compose ivy service, which provides an engine with the neo-test project. Then simply run the Playwright test via UI.

## Production

Build the remix spa application for production:

```shellscript
npm run build
```

### Preview

You can preview the build locally with:

```shellscript
npm run serve
```
