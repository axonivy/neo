import { groupBy, toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createProcess as createProcessReq,
  deleteProcess as deleteProcessReq,
  getProcesses,
  type ProcessBean,
  type ProcessIdentifier as ProcessIdentifierBean,
  type ProcessInit
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

export type Process = ProcessBean;
export type ProcessIdentifier = ProcessIdentifierBean;

export const useProcessesApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'processes'], base: ws?.baseUrl, ws };
};

export const useGroupedProcesses = () => {
  const { queryKey, base, ws } = useProcessesApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return getProcesses({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          const grouped = groupBy(res.data, p => p.processIdentifier.project.pmv);
          return Object.entries(grouped)
            .map(([project, processes]) => ({ project, artifacts: processes }))
            .sort((a, b) => projectSort(a.project, b.project, ws));
        }
        toast.error('Failed to load processes', { description: 'Maybe the server is not correclty started' });
        return [];
      });
    }
  });
};

export const useCreateProcess = () => {
  const { queryKey, base } = useProcessesApi();
  const client = useQueryClient();
  const createProcess = async (process: ProcessInit) => {
    const res = await createProcessReq(process, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, 'Failed to create process'));
  };
  return {
    createProcess: (process: ProcessInit) => {
      const newProcess = createProcess(process);
      toast.promise(() => newProcess, { loading: 'Creating process', success: 'Process created', error: e => e.message });
      return newProcess;
    }
  };
};

export const useDeleteProcess = () => {
  const { queryKey, base } = useProcessesApi();
  const client = useQueryClient();
  const deleteProcess = async (identifier: ProcessIdentifier) => {
    await deleteProcessReq(identifier, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(`Failed to remove process '${identifier.pid}'`);
    });
  };
  return {
    deleteProcess: (identifier: ProcessIdentifier) =>
      toast.promise(() => deleteProcess(identifier), { loading: 'Remove process', success: 'Process removed', error: e => e.message })
  };
};
