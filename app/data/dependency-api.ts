import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  addDependency as addDependencyReq,
  dependencies,
  type ProjectIdentifier,
  removeDependency as removeDependencyReq
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

const useDependenciesApi = () => {
  const ws = useWorkspace();
  const { app, project } = useParams();
  return { queryKey: ['neo', ws?.id, app, project, 'dependencies'], base: ws?.baseUrl, ws };
};

export const useDependencies = (app?: string, project?: string) => {
  const { t } = useTranslation();
  const { queryKey, base, ws } = useDependenciesApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined || app === undefined || project === undefined) return [];
      return dependencies(app, project, { headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.project, b.project, ws));
        }
        toast.error(t('toast.dependency.missing'), { description: t('toast.serverStatus') });
        return [];
      });
    },
    enabled: !!base && !!app && !!project
  });
};

export const useRemoveDependency = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useDependenciesApi();
  const client = useQueryClient();
  const removeDependency = async ({ app, project }: ProjectIdentifier, dependency: ProjectIdentifier) => {
    await removeDependencyReq(app, project, dependency.app, dependency.project, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(t('toast.dependency.removeFail', { project: dependency.project }));
    });
  };
  return {
    removeDependency: (dependent: ProjectIdentifier, dependency: ProjectIdentifier) =>
      toast.promise(() => removeDependency(dependent, dependency), {
        loading: t('toast.dependency.remove'),
        success: t('toast.dependency.removed'),
        error: e => e.message
      })
  };
};

export const useAddDependencyReq = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useDependenciesApi();
  const client = useQueryClient();
  const addDependency = async ({ app, project }: ProjectIdentifier, dependency?: ProjectIdentifier) => {
    if (dependency === undefined) return;
    const res = await addDependencyReq(app, project, dependency, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.dependency.addFail')));
  };
  return {
    addDependency: (dependent: ProjectIdentifier, dependency?: ProjectIdentifier) => {
      toast.promise(addDependency(dependent, dependency), {
        loading: t('toast.dependency.adding'),
        success: t('toast.dependency.added'),
        error: e => e.message
      });
    }
  };
};
