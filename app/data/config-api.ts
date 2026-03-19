import { toast } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok } from './custom-fetch';
import { configurations } from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

const useConfigurationsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'configurations'], base: ws?.baseUrl, ws };
};

export const useConfigurations = () => {
  const { queryKey, base, ws } = useConfigurationsApi();
  const { t } = useTranslation();
  return useQuery({
    queryKey,
    queryFn: () =>
      configurations({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data.sort((a, b) => projectSort(a.project.pmv, b.project.pmv, ws));
        }
        toast.error(t('toast.config.missing'), { description: t('toast.serverStatus') });
        return [];
      }),
    enabled: !!base
  });
};
