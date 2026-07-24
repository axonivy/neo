import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/workspaces/overview.tsx'),
  route(':ws', 'routes/workspace-layout.tsx', [
    index('routes/workspace/home.tsx'),
    route('projects/:app/:project', 'routes/projects/overview.tsx'),
    route('market', 'routes/market/market.tsx'),
    ...prefix('processes', [index('routes/processes/overview.tsx'), route(':app/:project/*', 'routes/processes/editor.tsx')]),
    ...prefix('forms', [index('routes/forms/overview.tsx'), route(':app/:project/*', 'routes/forms/editor.tsx')]),
    ...prefix('dataclasses', [index('routes/dataclasses/overview.tsx'), route(':app/:project/*', 'routes/dataclasses/editor.tsx')]),
    ...prefix('configurations', [index('routes/configurations/overview.tsx'), route(':app/:project/*', 'routes/configurations/editor.tsx')])
  ])
] satisfies RouteConfig;
