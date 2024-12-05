import { groupBy, toast } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import { configurations, readConfig, type ReadConfigParams } from './generated/openapi-dev';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

const useConfigurationsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'configurations'], base: ws?.baseUrl, ws };
};

export const useGroupedConfigurations = () => {
  const { queryKey, base, ws } = useConfigurationsApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return configurations({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          const grouped = groupBy(res.data, c => c.project.pmv);
          return Object.entries(grouped)
            .map(([project, configurations]) => ({ project, artifacts: configurations }))
            .sort((a, b) => projectSort(a.project, b.project, ws));
        }
        toast.error('Failed to load configurations', { description: 'Maybe the server is not correclty started' });
        return [];
      });
    }
  });
};

export const useReadConfiguration = ({ app, pmv, path }: ReadConfigParams) => {
  path = path?.startsWith('/') ? path.substring(1) : path;
  const { base, queryKey } = useConfigurationsApi();
  return useQuery({
    queryKey: [...queryKey, app, pmv, path],
    queryFn: () => {
      if (app === undefined || pmv === undefined || path === undefined) {
        return;
      }
      return readConfig({ app, pmv, path }, { headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        throw new Error(`Failed to read configuration with params: ${app} ${pmv} ${path}`);
      });
    }
  });
};
