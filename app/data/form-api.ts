import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReq, get, post } from './engine-api';
import { toast } from '@axonivy/ui-components';
import { ProjectIdentifier } from './project-api';
import { useWorkspace } from './workspace-api';

export type Form = {
  name: string;
  path: string;
  identifier: FormIdentifier;
};

export type FormIdentifier = {
  project: ProjectIdentifier;
  id: string;
};

type NewFormParams = {
  name: string;
  namespace: string;
  type: 'Form';
  project?: ProjectIdentifier;
  pid?: string;
};

export const useFormsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'forms'], base: ws?.baseUrl };
};

export const useForms = () => {
  const { queryKey, base } = useFormsApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      get({ url: 'forms', base }).then(res => {
        if (res?.ok) {
          return res.json() as Promise<Array<Form>>;
        } else {
          toast.error('Failed to load forms', { description: 'Maybe the server is not correclty started' });
        }
        return [];
      })
  });
};

export const useDeleteForm = () => {
  const client = useQueryClient();
  const { queryKey, base } = useFormsApi();
  const deleteForm = async (identifier: FormIdentifier) => {
    const res = await deleteReq({ url: 'form', base, data: identifier });
    if (res?.ok) {
      client.invalidateQueries({ queryKey });
    } else {
      throw new Error(`Failed to remove from '${identifier.id}'`);
    }
  };
  return {
    deleteForm: (identifier: FormIdentifier) =>
      toast.promise(() => deleteForm(identifier), { loading: 'Remove form', success: 'Form removed', error: e => e.message })
  };
};

export const useCreateForm = () => {
  const client = useQueryClient();
  const { queryKey, base } = useFormsApi();
  const createForm = async (form: NewFormParams) => {
    const res = await post({ url: 'hd', base, data: form });
    if (res?.ok) {
      const form = (await res.json()) as Form;
      client.invalidateQueries({ queryKey });
      return form;
    } else {
      throw new Error('Failed to create form');
    }
  };
  return {
    createForm: (form: NewFormParams) => {
      const newForm = createForm(form);
      toast.promise(() => newForm, { loading: 'Creating form', success: 'Form created', error: e => e.message });
      return newForm;
    }
  };
};
