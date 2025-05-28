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

export const useDependenciesApi = () => {
  const ws = useWorkspace();
  const { app, pmv } = useParams();
  return { queryKey: ['neo', ws?.id, app, pmv, 'dependencies'], base: ws?.baseUrl, ws };
};

export const useDependencies = (app?: string, pmv?: string) => {
  const { t } = useTranslation();
  const { queryKey, base, ws } = useDependenciesApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined || app === undefined || pmv === undefined) return [];
      return dependencies(app, pmv, { headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.pmv, b.pmv, ws));
        }
        toast.error(t('toast.dependency.missing'), { description: t('toast.serverStatus') });
        return [];
      });
    }
  });
};

export const useRemoveDependency = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useDependenciesApi();
  const client = useQueryClient();
  const removeDependency = async ({ app, pmv }: ProjectIdentifier, dependency: ProjectIdentifier) => {
    await removeDependencyReq(app, pmv, dependency.app, dependency.pmv, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(t('toast.dependency.removeFail', { pmv: dependency.pmv }));
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
  const addDependency = async ({ app, pmv }: ProjectIdentifier, dependency: ProjectIdentifier) => {
    const res = await addDependencyReq(app, pmv, dependency, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.dependency.addFail')));
  };
  return {
    addDependency: (dependent: ProjectIdentifier, dependency: ProjectIdentifier) => {
      toast.promise(addDependency(dependent, dependency), {
        loading: t('toast.dependency.adding'),
        success: t('toast.dependency.added'),
        error: e => e.message
      });
    }
  };
};
