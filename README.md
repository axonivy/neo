# Axon Ivy NEO Designer

[![translation-status](https://hosted.weblate.org/widget/axonivy/neo/neo/svg-badge.svg)](https://hosted.weblate.org/engage/axonivy/)

This repo contains the beta version of the Axon Ivy low-code Designer called Axon Ivy NEO Designer.
It uses Remix in SPA mode for the UI.

## Setup

```shellscript
pnpm i
pnpm run i18n:collect
```

## Development

Start an Axon Ivy Engine (on port 8080, you could use the provided Docker compose service) and hit F5 to launch or run:

```shellscript
pnpm run dev
```

### Playwright Tests

The easiest way to get started is to run the Docker compose ivy service, which provides an engine with the neo-test project. Then simply run the Playwright test via UI.

## Production

Build the remix spa application for production:

```shellscript
pnpm run build
```

### Preview

You can preview the build locally with:

```shellscript
pnpm run serve
```
