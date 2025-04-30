import { groupBy, toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createHd,
  deleteForm as deleteFormReq,
  forms,
  componentForm as getComponentFormReq,
  type ComponentFormParams,
  type FormIdentifier as FormIdentifierBean,
  type HdBean,
  type HdInit
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

export type Form = HdBean;
export type FormIdentifier = FormIdentifierBean;

export const useFormsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'forms'], base: ws?.baseUrl, ws };
};

export const useGroupedForms = () => {
  const { queryKey, base, ws } = useFormsApi();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return forms({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          const grouped = groupBy(res.data, f => f.identifier.project.pmv);
          return Object.entries(grouped)
            .map(([project, forms]) => ({ project, artifacts: forms }))
            .sort((a, b) => projectSort(a.project, b.project, ws));
        }
        toast.error('Failed to load forms', { description: 'Maybe the server is not correclty started' });
        return [];
      });
    }
  });
};

export const useComponentForm = () => {
  const { base } = useFormsApi();
  const getComponentForm = async (params: ComponentFormParams) => {
    const res = await getComponentFormReq(params, { headers: headers(base) });
    if (ok(res)) {
      return res.data;
    }
    throw new Error(`Failed to jump into component '${params.componentId}'`);
  };
  return {
    getComponentForm: (params: ComponentFormParams) =>
      toast.promise(() => getComponentForm(params), {
        error: e => e.message
      })
  };
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
    throw new Error(resolveErrorMessage(res.data, 'Failed to create form'));
  };
  return {
    createForm: (form: HdInit) => {
      const newForm = createForm(form);
      toast.promise(() => newForm, { loading: 'Creating form', success: 'Form created', error: e => e.message });
      return newForm;
    }
  };
};
