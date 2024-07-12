import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import { createProcess as createProcessReq, deleteProcess as deleteProcessReq, getProcesses } from './generated/openapi-dev';
import { ProjectIdentifier } from './project-api';
import { useWorkspace } from './workspace-api';

export type Process = {
  kind: string | number;
  name: string;
  namespace: string;
  path?: string;
  processGroup: string;
  processIdentifier: ProcessIdentifier;
  requestPath: string;
  type: string;
};

export type ProcessIdentifier = {
  project: ProjectIdentifier;
  pid: string;
};

export const useProcessesApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'processes'], base: ws?.baseUrl };
};

export const useProcesses = () => {
  const { queryKey, base } = useProcessesApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      getProcesses({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error('Failed to load processes', { description: 'Maybe the server is not correclty started' });
        return [];
      })
  });
};

type NewProcessParams = {
  name: string;
  namespace: string;
  kind: string;
  project?: ProjectIdentifier;
  pid?: string;
};

export const useCreateProcess = () => {
  const { queryKey, base } = useProcessesApi();
  const client = useQueryClient();
  const createProcess = async (process: NewProcessParams) => {
    const res = await createProcessReq(process, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error('Failed to create process');
  };
  return {
    createProcess: (process: NewProcessParams) => {
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
