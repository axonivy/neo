import { useQuery } from '@tanstack/react-query';
import { ok } from './custom-fetch';
import { getInfo } from './generated/openapi-default';

export const useEngineInfoApi = () => {
  return { queryKey: ['neo', 'engine-info'] };
};

export const useEngineVersion = () => {
  const { queryKey } = useEngineInfoApi();
  return useQuery({
    queryKey,
    queryFn: () =>
      getInfo().then(res => {
        const version = res.data.version;
        if (ok(res) && version) {
          return version.substring(0, version.lastIndexOf('.'));
        }
        throw new Error('Failed to load engine version');
      })
  });
};
