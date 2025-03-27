import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok } from './custom-fetch';
import {
  deleteProject as deleteProjectReq,
  projects,
  stopBpmEngine as stopBpmEngineReq,
  type ProjectIdentifier as ProjectId
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

export type ProjectIdentifier = ProjectId;

export const useProjectsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'projects'], base: ws?.baseUrl, ws };
};

export const useSortedProjects = () => {
  const { t } = useTranslation();
  const { queryKey, base, ws } = useProjectsApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return projects({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.id.pmv, b.id.pmv, ws));
        }
        toast.error(t('toast.project.missing'), { description: t('toast.serverStatus') });
        return [];
      });
    }
  });
};

export const useDeleteProject = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useProjectsApi();
  const client = useQueryClient();
  const deleteProject = async (identifier: ProjectIdentifier) => {
    await deleteProjectReq(identifier, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(t('toast.project.removeFail', { pmv: identifier.pmv }));
    });
  };
  return {
    deleteProject: (identifier: ProjectIdentifier) =>
      toast.promise(() => deleteProject(identifier), {
        loading: t('toast.project.removing'),
        success: t('toast.project.removed'),
        error: e => e.message
      })
  };
};

export const useStopBpmEngine = () => {
  const { t } = useTranslation();
  const { base } = useProjectsApi();
  const stopBpmEngine = async (identifier: ProjectIdentifier) => {
    await stopBpmEngineReq(identifier, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        return;
      }
      throw new Error(t('toast.project.bpmnEngineStopFail', { pmv: identifier.pmv }));
    });
  };
  return {
    stopBpmEngine: (identifier: ProjectIdentifier) =>
      toast.promise(() => stopBpmEngine(identifier), {
        loading: t('toast.project.bpmnEngineStopping'),
        success: t('toast.project.bpmnEngineStopped'),
        error: e => e.message
      })
  };
};
