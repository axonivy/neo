import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReq, get, post } from './engine-api';
import { editorOfPath, useEditors } from '~/neo/useEditors';
import { toast } from '@axonivy/ui-components';

export type Process = {
  name: string;
  path: string;
  processIdentifier: ProcessIdentifier;
};

export type ProcessIdentifier = {
  app: string;
  pmv: string;
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
      }),
    initialData: []
  });
};

type NewProcessParams = {
  name: string;
  namespace: string;
  path: string;
  kind: string;
  pid?: string;
};

export const useCreateProcess = () => {
  const client = useQueryClient();
  const { openEditor } = useEditors();
  const createProcess = async (process: NewProcessParams) => {
    const res = await post('process', process);
    if (res?.ok) {
      client.invalidateQueries({ queryKey: ['processes'] });
      // FIXME hardcode app and pmv for now. Must be queried form the backend in the end
      openEditor(editorOfPath('processes', 'designer', 'workflow-demos', `${process.namespace}/${process.name}`));
    } else {
      toast.error('Failed to add new process', { description: 'Maybe the server is not correclty started' });
    }
  };
  return { createProcess };
};

export const useDeleteProcess = () => {
  const client = useQueryClient();
  const deleteProcess = async (identifier: ProcessIdentifier) => {
    const res = await deleteReq('process', identifier);
    if (res?.ok) {
      client.invalidateQueries({ queryKey: ['processes'] });
    } else {
      toast.error(`Failed to remove process '${identifier.pid}'`, { description: 'Maybe the server is not correclty started' });
    }
  };
  return { deleteProcess };
};
