import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import {
  createHd,
  deleteForm as deleteFormReq,
  forms,
  HdBean,
  HdInit,
  type FormIdentifier as FormIdentifierBean
} from './generated/openapi-dev';
import { useWorkspace } from './workspace-api';

export type Form = HdBean;
export type FormIdentifier = FormIdentifierBean;

export const useFormsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'forms'], base: ws?.baseUrl };
};

export const useForms = () => {
  const { queryKey, base } = useFormsApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      forms({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error('Failed to load forms', { description: 'Maybe the server is not correclty started' });
        return [];
      })
  });
};

export const useDeleteForm = () => {
  const client = useQueryClient();
  const { queryKey, base } = useFormsApi();
  const deleteForm = async (identifier: FormIdentifier) => {
    const res = await deleteFormReq(identifier, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return;
    }
    throw new Error(`Failed to remove from '${identifier.id}'`);
  };
  return {
    deleteForm: (identifier: FormIdentifier) =>
      toast.promise(() => deleteForm(identifier), { loading: 'Remove form', success: 'Form removed', error: e => e.message })
  };
};

export const useCreateForm = () => {
  const client = useQueryClient();
  const { queryKey, base } = useFormsApi();
  const createForm = async (form: HdInit) => {
    const res = await createHd({ ...form, type: 'Form' }, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error('Failed to create form');
  };
  return {
    createForm: (form: HdInit) => {
      const newForm = createForm(form);
      toast.promise(() => newForm, { loading: 'Creating form', success: 'Form created', error: e => e.message });
      return newForm;
    }
  };
};
