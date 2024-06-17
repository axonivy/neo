import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReq, get } from './engine-api';
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

export const useDeleteForm = () => {
  const client = useQueryClient();
  const deleteForm = async (identifier: FormIdentifier) => {
    const res = await deleteReq('form', identifier);
    if (res?.ok) {
      client.invalidateQueries({ queryKey: ['forms'] });
    } else {
      throw new Error(`Failed to remove from '${identifier.id}'`);
    }
  };
  return {
    deleteForm: (identifier: FormIdentifier) =>
      toast.promise(() => deleteForm(identifier), { loading: 'Remove form', success: 'From removed', error: e => e.message })
  };
};
