import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createProcess as createProcessReq,
  deleteProcess as deleteProcessReq,
  getProcesses,
  importProcess,
  type ProcessBean,
  type ProcessIdentifier as ProcessIdentifierBean,
  type ProcessInit,
  type ProjectIdentifier
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

export type Process = ProcessBean;
export type ProcessIdentifier = ProcessIdentifierBean;

export const useProcessesApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'processes'], base: ws?.baseUrl, ws };
};

export const useProcesses = () => {
  const { t } = useTranslation();
  const { queryKey, base, ws } = useProcessesApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return getProcesses({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.processIdentifier.project.pmv, b.processIdentifier.project.pmv, ws));
        }
        toast.error(t('toast.process.missing'), { description: t('toast.serverStatus') });
        return [];
      });
    }
  });
};

export const useCreateProcess = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useProcessesApi();
  const client = useQueryClient();
  const createProcess = async (process: ProcessInit) => {
    const res = await createProcessReq(process, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.process.createFail')));
  };
  return {
    createProcess: (process: ProcessInit) => {
      const newProcess = createProcess(process);
      toast.promise(() => newProcess, { loading: t('toast.process.creating'), success: t('toast.process.created'), error: e => e.message });
      return newProcess;
    }
  };
};

export const useImportBpmnFile = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useProcessesApi();
  const client = useQueryClient();
  const importBpmnFile = async (project: ProjectIdentifier, file: Blob) => {
    const res = await importProcess({ ...project, file }, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.process.bpmn.importFail')));
  };
  return {
    importBpmnFile: (project: ProjectIdentifier, file: Blob) => {
      const importPromise = importBpmnFile(project, file);
      toast.promise(() => importPromise, {
        loading: t('toast.process.bpmn.importing'),
        success: t('toast.process.bpmn.imported'),
        error: e => e.message
      });
      return importPromise;
    }
  };
};

export const useDeleteProcess = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useProcessesApi();
  const client = useQueryClient();
  const deleteProcess = async (identifier: ProcessIdentifier) => {
    await deleteProcessReq(identifier, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(t('toast.process.removeFail', { pid: identifier.pid }));
    });
  };
  return {
    deleteProcess: (identifier: ProcessIdentifier) =>
      toast.promise(() => deleteProcess(identifier), {
        loading: t('toast.process.removing'),
        success: t('toast.process.removed'),
        error: e => e.message
      })
  };
};
