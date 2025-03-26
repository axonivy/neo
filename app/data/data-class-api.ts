import { groupBy, toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createDataClass as createDataClassReq,
  dataClasses,
  type DataClassIdentifier,
  type DataClassInit,
  deleteDataClass as deleteDataClassReq
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

const useDataClassesApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'dataclasses'], base: ws?.baseUrl, ws };
};

export const useGroupedDataClasses = () => {
  const { queryKey, base, ws } = useDataClassesApi();
  const { t } = useTranslation();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return dataClasses({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          const grouped = groupBy(res.data, p => p.dataClassIdentifier.project.pmv);
          return Object.entries(grouped)
            .map(([project, dataClasses]) => ({ project, artifacts: dataClasses }))
            .sort((a, b) => projectSort(a.project, b.project, ws));
        }
        toast.error(t('toast.dataClass.missing'), { description: t('toast.serverStatus') });
        return [];
      });
    }
  });
};

export const useCreateDataClass = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { queryKey, base } = useDataClassesApi();
  const createDataClass = async (dataClass: DataClassInit) => {
    const res = await createDataClassReq(dataClass, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.dataClass.creationFail')));
  };
  return {
    createDataClass: (dataClass: DataClassInit) => {
      const newDataClass = createDataClass(dataClass);
      toast.promise(() => newDataClass, {
        loading: t('toast.dataClass.create'),
        success: t('toast.dataClass.created'),
        error: e => e.message
      });
      return newDataClass;
    }
  };
};

export const useDeleteDataClass = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { queryKey, base } = useDataClassesApi();
  const deleteDataClass = async (identifier: DataClassIdentifier) => {
    const res = await deleteDataClassReq(identifier, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return;
    }
    throw new Error(t('toast.dataClass.removeFail', { name: identifier.name }));
  };
  return {
    deleteDataClass: (identifier: DataClassIdentifier) =>
      toast.promise(() => deleteDataClass(identifier), {
        loading: t('toast.dataClass.removing'),
        success: t('toast.dataClass.removed'),
        error: e => e.message
      })
  };
};
