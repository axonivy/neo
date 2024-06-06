import { useQuery, useQueryClient } from '@tanstack/react-query';
import { get, post } from './engine-api';
import { editorOfPath, useEditors } from '~/neo/useEditors';

export type Process = {
  name: string;
  path: string;
};

export const useProcesses = () => {
  return useQuery({
    queryKey: ['processes'],
    queryFn: () => get('processes').then(res => res.json() as Promise<Array<Process>>),
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
    await post('process', process);
    client.invalidateQueries({ queryKey: ['processes'] });
    openEditor(editorOfPath('processes', `${process.namespace}/${process.name}`));
  };
  return { createProcess };
};
