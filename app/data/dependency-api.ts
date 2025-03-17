import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { headers, ok } from './custom-fetch';
import {
  addDependency as addDependencyReq,
  dependencies,
  type ProjectIdentifier,
  removeDependency as removeDependencyReq
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

export const useDependenciesApi = () => {
  const ws = useWorkspace();
  const { app, pmv } = useParams();
  return { queryKey: ['neo', ws?.id, app, pmv, 'dependencies'], base: ws?.baseUrl, ws };
};

export const useDependencies = (app?: string, pmv?: string) => {
  const { queryKey, base, ws } = useDependenciesApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined || app === undefined || pmv === undefined) return [];
      return dependencies(app, pmv, { headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.pmv, b.pmv, ws));
        }
        toast.error('Failed to load projects', { description: 'Maybe the server is not correclty started' });
        return [];
      });
    }
  });
};

export const useRemoveDependency = () => {
  const { queryKey, base } = useDependenciesApi();
  const client = useQueryClient();
  const removeDependency = async ({ app, pmv }: ProjectIdentifier, dependency: ProjectIdentifier) => {
    await removeDependencyReq(app, pmv, dependency.app, dependency.pmv, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(`Failed to remove dependency '${dependency.pmv}'`);
    });
  };
  return {
    removeDependency: (dependent: ProjectIdentifier, dependency: ProjectIdentifier) =>
      toast.promise(() => removeDependency(dependent, dependency), {
        loading: 'Remove dependency',
        success: 'Dependency removed',
        error: e => e.message
      })
  };
};

export const useAddDependencyReq = () => {
  const { queryKey, base } = useDependenciesApi();
  const client = useQueryClient();
  const addDependency = async ({ app, pmv }: ProjectIdentifier, dependency: ProjectIdentifier) => {
    const res = await addDependencyReq(app, pmv, dependency, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error('Failed to add dependency');
  };
  return {
    addDependency: (dependent: ProjectIdentifier, dependency: ProjectIdentifier) => {
      toast.promise(addDependency(dependent, dependency), {
        loading: 'Adding dependency',
        success: 'Added dependency',
        error: e => e.message
      });
    }
  };
};
