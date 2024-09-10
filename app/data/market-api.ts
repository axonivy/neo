import { toast } from '@axonivy/ui-components';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import {
  findProductJsonContent,
  findProducts,
  FindProductsParams,
  findVersionsForDesigner,
  PagedModelProductModel
} from './generated/openapi-market';

const useMarketApi = () => {
  return {
    queryKey: ['market'],
    headers: { 'X-Requested-By': 'ivy', ...headers('https://market-preview.ivy-cloud.com/marketplace-service') }
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
      findVersionsForDesigner(id, { headers }).then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error(`Failed to load market product versions for ${id}`, { description: 'Maybe the market is currently not accessible' });
        return [];
      })
  });
};

export const useProductJson = () => {
  const { headers } = useMarketApi();
  const productJson = async (id: string, version: string) => {
    const res = await findProductJsonContent(id, version, { headers });
    if (ok(res)) {
      return res.data;
    }
    throw new Error('Failed to load product json');
  };
  return {
    productJson: (id: string, version: string) => {
      return productJson(id, version);
    }
  };
};
