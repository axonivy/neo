import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/workspaces/overview.tsx'),
  route(':ws', 'routes/workspace-layout.tsx', [
    index('routes/workspaces/home.tsx'),
    route('projects/:app/:pmv', 'routes/project.tsx'),
    route('market', 'routes/market.tsx'),
    route('log', 'routes/runtime-log.tsx'),
    ...prefix('processes', [index('routes/processes/overview.tsx'), route(':app/:pmv/*', 'routes/processes/editor.tsx')]),
    ...prefix('forms', [index('routes/forms/overview.tsx'), route(':app/:pmv/*', 'routes/forms/editor.tsx')]),
    ...prefix('dataclasses', [index('routes/dataclasses/overview.tsx'), route(':app/:pmv/*', 'routes/dataclasses/editor.tsx')]),
    ...prefix('configurations', [index('routes/configurations/overview.tsx'), route(':app/:pmv/*', 'routes/configurations/editor.tsx')])
  ])
] satisfies RouteConfig;
