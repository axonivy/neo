import { useQuery } from '@tanstack/react-query';
import { get } from './engine-api';

export type Process = {
  name: string;
  path: string;
};

export const useProcesses = () => {
  const { data } = useQuery({
    queryKey: ['processes'],
    queryFn: () => get('processes').then(res => res.json() as Promise<Array<Process>>),
    initialData: []
  });
  return data;
};
