import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReq, get, post } from './engine-api';
import { editorOfPath, useEditors } from '~/neo/useEditors';
import { toast } from '@axonivy/ui-components';
import { ProjectIdentifier } from './project-api';

export type Process = {
  kind: number;
  name: string;
  namespace: string;
  path: string;
  processGroup: string;
  processIdentifier: ProcessIdentifier;
  requestPath: string;
  type: string;
};

export type ProcessIdentifier = {
  project: ProjectIdentifier;
  pid: string;
};

export const useProcesses = () => {
  return useQuery({
    queryKey: ['processes'],
    queryFn: () =>
      get('processes').then(res => {
        if (res?.ok) {
          return res.json() as Promise<Array<Process>>;
        } else {
          toast.error('Failed to load processes', { description: 'Maybe the server is not correclty started' });
        }
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
  const client = useQueryClient();
  const { openEditor } = useEditors();
  const createProcess = async (process: NewProcessParams, postCreateAction: () => void = () => {}) => {
    const res = await post('process', process);
    if (res?.ok) {
      postCreateAction();
      const process = (await res.json()) as Process;
      client.invalidateQueries({ queryKey: ['processes'] });
      openEditor(editorOfPath('processes', process.processIdentifier.project, process.path));
    } else {
      throw new Error('Failed to create process');
    }
  };
  return {
    createProcess: (process: NewProcessParams, postCreateAction?: () => void) =>
      toast.promise(() => createProcess(process, postCreateAction), {
        loading: 'Creating process',
        success: 'Process created',
        error: e => e.message
      })
  };
};

export const useDeleteProcess = () => {
  const client = useQueryClient();
  const deleteProcess = async (identifier: ProcessIdentifier) => {
    const res = await deleteReq('process', identifier);
    if (res?.ok) {
      client.invalidateQueries({ queryKey: ['processes'] });
    } else {
      throw new Error(`Failed to remove process '${identifier.pid}'`);
    }
  };
  return {
    deleteProcess: (identifier: ProcessIdentifier) =>
      toast.promise(() => deleteProcess(identifier), { loading: 'Remove process', success: 'Process removed', error: e => e.message })
  };
};
