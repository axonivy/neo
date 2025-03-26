import { groupBy, toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok } from './custom-fetch';
import {
  type ConfigurationBean,
  configurations,
  readConfig,
  type ReadConfigParams,
  writeConfig as writeConfigReq
} from './generated/ivy-client';
import { projectSort } from './sort';
import { useWorkspace } from './workspace-api';

const useConfigurationsApi = () => {
  const ws = useWorkspace();
  return { queryKey: ['neo', ws?.id, 'configurations'], base: ws?.baseUrl, ws };
};

export const useGroupedConfigurations = () => {
  const { queryKey, base, ws } = useConfigurationsApi();
  const { t } = useTranslation();
  return useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return [];
      return configurations({ headers: headers(base) }).then(res => {
        if (ok(res)) {
          const grouped = groupBy(res.data, c => c.project.pmv);
          return Object.entries(grouped)
            .map(([project, configurations]) => ({ project, artifacts: configurations }))
            .sort((a, b) => projectSort(a.project, b.project, ws));
        }
        toast.error(t('toast.config.missing'), { description: t('toast.serverStatus') });
        return [];
      });
    }
  });
};

export const useReadConfiguration = ({ app, pmv, path }: ReadConfigParams) => {
  const { t } = useTranslation();
  const { base, queryKey } = useConfigurationsApi();
  return useQuery({
    queryKey: [...queryKey, app, pmv, path],
    queryFn: () => {
      if (base === undefined || app === undefined || pmv === undefined || path === undefined) {
        return;
      }
      return readConfig({ app, pmv, path }, { headers: headers(base) }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        throw new Error(t('toast.config.readFail', { app: app, pmv: pmv, path: path }));
      });
    }
  });
};

export const useWriteConfiguration = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { queryKey, base } = useConfigurationsApi();
  const writeConfig = async (bean: ConfigurationBean) => {
    const res = await writeConfigReq(bean, { headers: headers(base) });
    if (ok(res)) {
      client.invalidateQueries({ queryKey: [...queryKey, bean.id.project.app, bean.id.project.pmv, bean.id.path] });
      return res.data;
    }
    throw new Error(t('toast.config.writeFail', { app: bean.id.project.app, pmv: bean.id.project.pmv, path: bean.id.path }));
  };
  return {
    writeConfig: (bean: ConfigurationBean) => {
      const newBean = writeConfig(bean);
      toast.promise(() => newBean, { loading: t('toast.config.writing'), success: t('toast.config.saved'), error: e => e.message });
      return newBean;
    }
  };
};
