import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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

const useFormsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'forms'], base: ws?.baseUrl, ws };
};

export const useForms = () => {
  const { t } = useTranslation();
  const { queryKey, base, ws } = useFormsApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      forms({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.identifier.project.pmv, b.identifier.project.pmv, ws));
        }
        toast.error(t('toast.form.missing'), { description: t('toast.serverStatus') });
        return [];
      }),
    enabled: !!base
  });
};

export const useComponentForm = () => {
  const { t } = useTranslation();
  const { base } = useFormsApi();
  const getComponentForm = async (params: ComponentFormParams) => {
    const res = await getComponentFormReq(params, { headers: headers(base) });
    if (ok(res)) {
      return res.data;
    }
    throw new Error(t('toast.form.jumpIntoFailed', { id: params.componentId }));
  };
  return {
    getComponentForm: (params: ComponentFormParams) =>
      toast.promise(() => getComponentForm(params), {
        error: e => e.message
      })
  };
};

export const useDeleteForm = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { queryKey, base } = useFormsApi();
  const deleteForm = async (identifier: FormIdentifier) => {
    const res = await deleteFormReq(identifier, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return;
    }
    throw new Error(t('toast.form.removeFail', { id: identifier.id }));
  };

  return {
    deleteForm: (identifier: FormIdentifier) =>
      toast.promise(() => deleteForm(identifier), {
        loading: t('toast.form.removing'),
        success: t('toast.form.removed'),
        error: e => e.message
      })
  };
};

export const useCreateForm = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { queryKey, base } = useFormsApi();
  const createForm = async (form: HdInit) => {
    const res = await createHd({ ...form, type: 'Form' }, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.form.createFail')));
  };
  return {
    createForm: (form: HdInit) => {
      const newForm = createForm(form);
      toast.promise(() => newForm, { loading: t('toast.form.creating'), success: t('toast.form.created'), error: e => e.message });
      return newForm;
    }
  };
};
