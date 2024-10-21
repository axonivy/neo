import { Flex } from '@axonivy/ui-components';
import type { MetaFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import type { ProductModel } from '~/data/generated/openapi-market';
import { useProducts } from '~/data/market-api';
import { cardLinks } from '~/neo/artifact/ArtifactCard';
import { InstallMarketArtifactDialogProvider, useInstallMarketArtifact } from '~/neo/artifact/useInstallMarketArtifact';
import { Overview } from '~/neo/Overview';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Market' }, { name: 'description', content: 'Axon Ivy Market Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useProducts();
  const products =
    data?.pages
      .flatMap(page => page)
      ?.filter(product => {
        const lowerCaseSearch = search.toLocaleLowerCase();
        return (
          product.names?.en.toLocaleLowerCase().includes(lowerCaseSearch) ||
          product.shortDescriptions?.en.includes(lowerCaseSearch) ||
          product.type?.includes(lowerCaseSearch)
        );
      }) ?? [];
  useEffect(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  });
  return (
    <InstallMarketArtifactDialogProvider>
      <Overview title='Axon Ivy Market' search={search} onSearchChange={setSearch} isPending={isPending}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Overview>
    </InstallMarketArtifactDialogProvider>
  );
}

export const ProductCard = ({ product }: { product: ProductModel }) => {
  const open = useInstallMarketArtifact();
  const preview = <img src={product.logoUrl} width={70} alt={'product logo'} />;
  const title = product.names?.en ?? '';
  return (
    <div className='artifact-card'>
      <button className='card' onClick={() => open(product)}>
        <Flex direction='column' justifyContent='space-between' gap={2} className='card-content'>
          <Flex alignItems='center' justifyContent='center' className='card-preview'>
            {preview}
          </Flex>
          <Flex alignItems='center' justifyContent='space-between' gap={1}>
            <span className='card-name'>{title}</span>
          </Flex>
        </Flex>
      </button>
    </div>
  );
};
