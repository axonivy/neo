import { toast } from '@axonivy/ui-components';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
  return {
    queryKey: ['market'],
    headers: { 'X-Requested-By': 'ivy', ...headers(`${MARKET_URL}/marketplace-service`) }
  };
};

const products = async (pageParam: number, headers: HeadersInit) => {
  const params: FindProductsParams = {
    isRESTClient: false,
    page: pageParam,
    sort: [],
    language: 'en',
    type: 'all'
  };
  return findProducts(params, { headers }).then(res => {
    if (ok(res)) {
      const data = JSON.parse(res.data as string) as PagedModelProductModel;
      return data._embedded?.products ?? [];
    }
    toast.error('Failed to load market products', { description: 'Maybe the market is currently not accessible' });
    return [];
  });
};

export const useProducts = () => {
  const { queryKey, headers } = useMarketApi();
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

export const useProductVersions = (id: string) => {
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'versions', id],
    queryFn: () =>
      findProductVersionsById(id, { isShowDevVersion: true }, { headers }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error(`Failed to load market product versions for ${id}`, { description: 'Maybe the market is currently not accessible' });
        return [];
      })
  });
};

export const useProductJson = (id: string, version?: string) => {
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'productJson', id, version],
    queryFn: () => {
      if (version === undefined) {
        throw Error(`Artifact version of ${id} needs to be defined to retrieve product json`);
      }
      return findProductJsonContent(id, version, {}, { headers }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        throw new Error('Failed to load product json  for ' + id + ' with version ' + version);
      });
    }
  });
};

export const useBestMatchingVersion = (id: string, engineVersion?: string) => {
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'bestMatchingVersion', id, engineVersion],
    queryFn: () => {
      if (!engineVersion) return '';
      return findBestMatchProductDetailsByVersion(id, engineVersion, { headers }).then(res => {
        if (ok(res)) {
          const data = JSON.parse(res.data as string) as ProductDetailModel;
          return data.productModuleContent?.version ?? '';
        }
        throw new Error(`Failed to load best matching market artifact version for ${id} with engine version ${engineVersion}`);
      });
    }
  });
};
