import { useQuery } from '@tanstack/react-query';
import { get } from './engine-api';
import { toast } from '@axonivy/ui-components';
import { useWorkspace } from './workspace-api';

export type ProjectIdentifier = {
  app: string;
  pmv: string;
};

export const useProjectsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'projects'], apiUrl: { url: 'projects', base: ws?.baseUrl } };
};

export const useProjects = () => {
  const { queryKey, apiUrl } = useProjectsApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      get(apiUrl).then(res => {
        if (res?.ok) {
          return res.json() as Promise<Array<ProjectIdentifier>>;
        } else {
          toast.error('Failed to load projects', { description: 'Maybe the server is not correclty started' });
        }
        return [];
      })
  });
};
