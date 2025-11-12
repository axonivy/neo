import { toast } from '@axonivy/ui-components';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { headers, ok } from './custom-fetch';
import {
  findBestMatchProductDetailsByVersion,
  findProductJsonContent,
  findProducts,
  type FindProductsParams,
  findProductVersionsById,
  type PagedModelProductModel,
  type ProductDetailModel
} from './generated/market-client';

export const MARKET_URL = 'https://market.axonivy.com';

const useMarketApi = () => {
  return { queryKey: ['market'], headers: { 'X-Requested-By': 'ivy', ...headers(`${MARKET_URL}/marketplace-service`) } };
};

export const useProducts = () => {
  const { queryKey, headers } = useMarketApi();
  const { t } = useTranslation();

  const products = async (pageParam: number, headers: HeadersInit) => {
    const params: FindProductsParams = { isRESTClient: false, page: pageParam, sort: [], language: 'en', type: 'all' };
    return findProducts(params, { headers }).then(res => {
      if (ok(res)) {
        const data = JSON.parse(res.data as string) as PagedModelProductModel;
        return data._embedded?.products ?? [];
      }
      toast.error(t('toast.market.missing'), { description: t('toast.serverStatus') });
      return [];
    });
  };

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => products(pageParam, headers),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage?.length === 0) {
        return;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return;
      }
      return firstPageParam - 1;
    }
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
          const data = JSON.parse(res.data as string) as ProductDetailModel;
          return data.productModuleContent?.version ?? null;
        }
        throw new Error(t('toast.market.loadBestMatchingFail', { id: id, engineVersion: engineVersion }));
      });
    },
    enabled: !!id && !!engineVersion
  });
};
