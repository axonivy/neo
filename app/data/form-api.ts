import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReq, get, post } from './engine-api';
import { toast } from '@axonivy/ui-components';
import { ProjectIdentifier } from './project-api';
import { createFormEditor, useEditors } from '~/neo/editors/useEditors';

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
      })
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
      toast.promise(() => deleteForm(identifier), { loading: 'Remove form', success: 'Form removed', error: e => e.message })
  };
};

export const useCreateForm = () => {
  const client = useQueryClient();
  const { openEditor } = useEditors();
  const createForm = async (form: NewFormParams, postCreateAction: () => void = () => {}) => {
    const res = await post('hd', form);
    if (res?.ok) {
      postCreateAction();
      const form = (await res.json()) as Form;
      client.invalidateQueries({ queryKey: ['forms'] });
      openEditor(createFormEditor(form));
    } else {
      throw new Error('Failed to create form');
    }
  };
  return {
    createForm: (form: NewFormParams, postCreateAction?: () => void) =>
      toast.promise(() => createForm(form, postCreateAction), { loading: 'Creating form', success: 'Form created', error: e => e.message })
  };
};
