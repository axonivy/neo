import { useQuery, useQueryClient } from '@tanstack/react-query';
import { get, post } from './engine-api';
import { editorOfPath, useEditors } from '~/neo/useEditors';
import { toast } from '@axonivy/ui-components';

export type Process = {
  name: string;
  path: string;
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
      openEditor(editorOfPath('processes', `${process.namespace}/${process.name}`));
    } else {
      toast.error('Failed to add new process', { description: 'Maybe the server is not correclty started' });
    }
  };
  return { createProcess };
};
