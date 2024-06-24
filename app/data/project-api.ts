import { useQuery } from '@tanstack/react-query';
import { get } from './engine-api';
import { toast } from '@axonivy/ui-components';

export type ProjectIdentifier = {
  app: string;
  pmv: string;
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      get('projects').then(res => {
        if (res?.ok) {
          return res.json() as Promise<Array<ProjectIdentifier>>;
        } else {
          toast.error('Failed to load projects', { description: 'Maybe the server is not correclty started' });
        }
        return [];
      })
  });
};

export const watchProjects = () => {
  get('projects/watch').then(res => {
    if (res?.ok) {
      return;
    } else {
      toast.error('Failed to watch projects', { description: 'Maybe the server is not correclty started' });
    }
  });
};
