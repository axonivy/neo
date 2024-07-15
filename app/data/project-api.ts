import { toast } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import { projects, type ProjectIdentifier as ProjectId } from './generated/openapi-dev';
import { useWorkspace } from './workspace-api';

export type ProjectIdentifier = ProjectId;

export const useProjectsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'projects'], base: ws?.baseUrl };
};

export const useProjects = () => {
  const { queryKey, base } = useProjectsApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      projects({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error('Failed to load projects', { description: 'Maybe the server is not correclty started' });
        return [];
      })
  });
};
