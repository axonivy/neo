import { toast } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import {
  findBestMatchProductDetailsByVersion,
  findProductJsonContent,
  findProducts,
  type FindProductsParams,
  findProductVersionsById,
  type MavenArtifactVersionModel
} from './generated/market-client';

export const MARKET_URL = 'https://market.axonivy.com';

const useMarketApi = () => {
  return {
    queryKey: ['market'],
    headers: { 'X-Requested-By': 'ivy', ...headers(`${MARKET_URL}/stable`) }
  };
};

const products = async (headers: HeadersInit) => {
  const params: FindProductsParams = { language: 'en', type: 'all' };
  return findProducts(params, { headers }).then(res => {
    if (ok(res)) {
      return res.data;
    }
    toast.error('Failed to load market products', { description: 'Maybe the market is currently not accessible' });
    return [];
  });
};

export const useProducts = () => {
  const { queryKey, headers } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'products'],
    queryFn: () => products(headers)
  });
};

export const useProductVersions = (id: string) => {
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    queryKey: [...queryKey, 'versions', id],
    queryFn: () =>
      findProductVersionsById(id, { isShowDevVersion: true }, { headers }).then(res => {
        if (ok(res)) {
          return res.data as unknown as MavenArtifactVersionModel[];
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
      return findProductJsonContent(id, { productVersion: version }, { headers }).then(res => {
        if (ok(res)) {
          return res.data as unknown;
        }
        throw new Error('Failed to load product json  for ' + id + ' with version ' + version);
      });
    }
  });
};

export const useBestMatchingVersion = (id: string, engineVersion?: string) => {
  const { headers, queryKey } = useMarketApi();
  return useQuery({
    retry: false,
    queryKey: [...queryKey, 'bestMatchingVersion', id, engineVersion],
    queryFn: () => {
      if (engineVersion === undefined || id === undefined) return null;
      return findBestMatchProductDetailsByVersion(id, engineVersion, { isShowDevVersion: true }, { headers }).then(res => {
        if (ok(res)) {
          return res.data.version ?? '';
        }
        throw new Error(`Failed to load best matching market artifact version for ${id} with engine version ${engineVersion}`);
      });
    },
    enabled: !!id && !!engineVersion
  });
};
