import { toast } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok } from './custom-fetch';
import {
  findBestMatchProductDetailsByVersion,
  findProductJsonContent,
  findProducts,
  type FindProductsParams,
  findProductVersionsById
} from './generated/market-client';

export const MARKET_URL = 'http://localhost:5173/stable-market';

const useMarketApi = () => {
  return { queryKey: ['market'], headers: { 'X-Requested-By': 'ivy', ...headers(`${MARKET_URL}/stable`) } };
};

export const useProducts = () => {
  const { queryKey, headers } = useMarketApi();
  const { t } = useTranslation();

  const products = async (headers: HeadersInit) => {
    const params: FindProductsParams = { language: 'en', type: 'all' };
    return findProducts(params, { headers }).then(res => {
      if (ok(res)) {
        return res.data;
      }
      toast.error(t('toast.market.missing'), { description: t('toast.serverStatus') });
      return [];
    });
  };

  return useQuery({
    queryKey,
    queryFn: () => products(headers)
  });
};

export const useProductVersions = (id?: string) => {
  const { t } = useTranslation();
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'versions', id],
    queryFn: () => {
      if (id === undefined) return [];
      return findProductVersionsById(id, { isShowDevVersion: true }, { headers }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error(t('toast.market.loadFail', { id: id }), { description: t('toast.market.inaccsessible') });
        return [];
      });
    },
    enabled: !!id
  });
};

export const useProductJson = (id?: string, version?: string) => {
  const { t } = useTranslation();
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'productJson', id, version],
    queryFn: () => {
      if (id === undefined || version === undefined) return null;
      return findProductJsonContent(id, version, {}, { headers }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        throw new Error(t('toast.market.loadJsonFail', { id: id, version: version }));
      });
    },
    enabled: !!id && !!version
  });
};

export const useBestMatchingVersion = (id?: string, engineVersion?: string) => {
  const { t } = useTranslation();
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'bestMatchingVersion', id, engineVersion],
    queryFn: () => {
      if (!engineVersion || !id) return null;
      return findBestMatchProductDetailsByVersion(id, engineVersion, { headers }).then(res => {
        if (ok(res)) {
          return res.data.productModuleContent?.version ?? null;
        }
        throw new Error(t('toast.market.loadBestMatchingFail', { id: id, engineVersion: engineVersion }));
      });
    },
    enabled: !!id && !!engineVersion
  });
};
