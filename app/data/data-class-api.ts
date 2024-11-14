import { groupBy, toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createDataClass as createDataClassReq,
  dataClasses,
  type DataClassIdentifier,
  type DataClassInit,
  deleteDataClass as deleteDataClassReq
} from './generated/openapi-dev';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

const useDataClassesApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'dataclasses'], base: ws?.baseUrl, ws };
};

export const useGroupedDataClasses = () => {
  const { queryKey, base, ws } = useDataClassesApi();
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
        toast.error('Failed to load data classes', { description: 'Maybe the server is not correclty started' });
        return [];
      });
    }
  });
};

export const useCreateDataClass = () => {
  const client = useQueryClient();
  const { queryKey, base } = useDataClassesApi();
  const createDataClass = async (dataClass: DataClassInit) => {
    const res = await createDataClassReq(dataClass, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, 'Failed to create data class'));
  };
  return {
    createDataClass: (dataClass: DataClassInit) => {
      const newDataClass = createDataClass(dataClass);
      toast.promise(() => newDataClass, { loading: 'Creating data class', success: 'Data class created', error: e => e.message });
      return newDataClass;
    }
  };
};

export const useDeleteDataClass = () => {
  const client = useQueryClient();
  const { queryKey, base } = useDataClassesApi();
  const deleteDataClass = async (identifier: DataClassIdentifier) => {
    const res = await deleteDataClassReq(identifier, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return;
    }
    throw new Error(`Failed to remove data class '${identifier.name}'`);
  };
  return {
    deleteDataClass: (identifier: DataClassIdentifier) =>
      toast.promise(() => deleteDataClass(identifier), {
        loading: 'Remove data class',
        success: 'Data class removed',
        error: e => e.message
      })
  };
};
