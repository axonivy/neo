import { useQuery } from '@tanstack/react-query';
import { get } from './engine-api';
import { toast } from '@axonivy/ui-components';

export type Form = {
  name: string;
  path: string;
  identifier: FormIdentifier;
};

export type FormIdentifier = {
  app: string;
  pmv: string;
  id: string;
};

export const useForms = () => {
  return useQuery({
    queryKey: ['forms'],
    queryFn: () =>
      get('forms').then(res => {
        if (res?.ok) {
          return res.json() as Promise<Array<Form>>;
        } else {
          toast.error('Failed to load forms', { description: 'Maybe the server is not correclty started' });
        }
        return [];
      }),
    initialData: []
  });
};
