import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ok } from './custom-fetch';
import { getInfo } from './generated/ivy-client';

const useEngineInfoApi = () => {
  return { queryKey: ['neo', 'engine-info'] };
};

export const useEngineVersion = () => {
  const { queryKey } = useEngineInfoApi();
  const { t } = useTranslation();
  return useQuery({
    queryKey,
    queryFn: () =>
      getInfo().then(res => {
        const version = res.data.version;
        if (ok(res) && version) {
          return version.substring(0, version.lastIndexOf('.'));
        }
        throw new Error(t('message.loadEngineVersionFail'));
      })
  });
};
