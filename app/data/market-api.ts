import { toast } from '@axonivy/ui-components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import { findProducts, FindProductsParams, PagedModelProductModel } from './generated/openapi-market';

export const useMarketApi = () => {
  return { queryKey: ['market'], base: 'https://market-preview.ivy-cloud.com/marketplace-service' };
};

const products = async (pageParam: number, base: string) => {
  const params: FindProductsParams = {
    isRESTClient: false,
    page: pageParam,
    sort: [],
    language: 'en',
    type: 'all'
  };
  return findProducts(params, { headers: { 'X-Requested-By': 'ivy', ...headers(base) } }).then(res => {
    if (ok(res)) {
      const data = JSON.parse(res.data as string) as PagedModelProductModel;
      return data._embedded?.products ?? [];
    }
    toast.error('Failed to market products', { description: 'Maybe the server is not correclty started' });
    return [];
  });
};

export const useProducts = () => {
  const { queryKey, base } = useMarketApi();
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => products(pageParam, base),
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
