import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import {
  createDataClass as createDataClassReq,
  dataClasses,
  DataClassIdentifier,
  DataClassInit,
  deleteDataClass as deleteDataClassReq
} from './generated/openapi-dev';
import { useWorkspace } from './workspace-api';

const useDataClassesApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'dataclasses'], base: ws?.baseUrl };
};

export const useDataClasses = () => {
  const { queryKey, base } = useDataClassesApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      dataClasses({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error('Failed to load data classes', { description: 'Maybe the server is not correclty started' });
        return [];
      })
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
    throw new Error('Failed to create data class');
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
