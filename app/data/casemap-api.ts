import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createCaseMap as createCaseMapReq,
  deleteCaseMap as deleteCaseMapReq,
  getCaseMaps,
  type CaseMapBean,
  type CaseMapIdentifier,
  type CaseMapInit
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

export type CaseMap = CaseMapBean;

const useCaseMapApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'casemaps'], base: ws?.baseUrl, ws };
};

export const useCaseMaps = () => {
  const { t } = useTranslation();
  const { queryKey, base, ws } = useCaseMapApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      getCaseMaps({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.caseMapIdentifier.project.pmv, b.caseMapIdentifier.project.pmv, ws));
        }
        toast.error(t('toast.casemap.missing'), { description: t('toast.serverStatus') });
        return [];
      }),
    enabled: !!base
  });
};

export const useCreateCaseMap = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useCaseMapApi();
  const client = useQueryClient();
  const createCaseMap = async (caseMap: CaseMapInit) => {
    const res = await createCaseMapReq({ ...caseMap, namespace: caseMap.namespace.replaceAll('.', '/') }, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.casemap.createFail')));
  };
  return {
    createCaseMap: (caseMap: CaseMapInit) => {
      const newCaseMap = createCaseMap(caseMap);
      toast.promise(() => newCaseMap, { loading: t('toast.casemap.creating'), success: t('toast.casemap.created'), error: e => e.message });
      return newCaseMap;
    }
  };
};

export const useDeleteCaseMap = () => {
  const { t } = useTranslation();
  const { queryKey, base } = useCaseMapApi();
  const client = useQueryClient();
  const deleteCaseMap = async (identifier: CaseMapIdentifier) => {
    await deleteCaseMapReq(identifier, { headers: headers(base) }).then(res => {
      if (ok(res)) {
        client.invalidateQueries({ queryKey });
        return;
      }
      throw new Error(t('toast.casemap.removeFail', { name: identifier.name }));
    });
  };
  return {
    deleteCaseMap: (identifier: CaseMapIdentifier) =>
      toast.promise(() => deleteCaseMap(identifier), {
        loading: t('toast.casemap.removing'),
        success: t('toast.casemap.removed'),
        error: e => e.message
      })
  };
};
