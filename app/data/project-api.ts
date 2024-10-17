import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import { deleteProject as deleteProjectReq, projects, type ProjectIdentifier as ProjectId } from './generated/openapi-dev';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

export type ProjectIdentifier = ProjectId;

export const useProjectsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'projects'], base: ws?.baseUrl, ws };
};

export const useSortedProjects = () => {
  const { queryKey, base, ws } = useProjectsApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return projects({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.id.pmv, b.id.pmv, ws?.id));
        }
        toast.error('Failed to load projects', { description: 'Maybe the server is not correclty started' });
        return [];
      });
    }
  });
};

export const useDeleteProject = () => {
  const { queryKey, base } = useProjectsApi();
  const client = useQueryClient();
  const deleteProject = async (identifier: ProjectIdentifier) => {
    await deleteProjectReq(identifier, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(`Failed to remove project '${identifier.pmv}'`);
    });
  };
  return {
    deleteProject: (identifier: ProjectIdentifier) =>
      toast.promise(() => deleteProject(identifier), { loading: 'Remove project', success: 'Project removed', error: e => e.message })
  };
};
