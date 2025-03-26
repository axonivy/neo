import { groupBy, toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createHd,
  deleteForm as deleteFormReq,
  forms,
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
  const { t } = useTranslation();
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
        toast.error(t('toast.form.missing'), { description: t('toast.serverStatus') });
        return [];
      });
    }
  });
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
