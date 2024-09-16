import type { MetaFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { ProductModel } from '~/data/generated/openapi-market';
import { useProducts } from '~/data/market-api';
import { cardLinks, InstallMarketArtifactCard } from '~/neo/artifact/ArtifactCard';
import { useInstallMarketArtifact } from '~/neo/artifact/useInstallMarketArtifact';
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
    <Overview title='Axon Ivy Market' search={search} onSearchChange={setSearch} isPending={isPending}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Overview>
  );
}

export const ProductCard = ({ product }: { product: ProductModel }) => {
  const open = useInstallMarketArtifact();
  const preview = <img src={product.logoUrl} width={70} alt={'product logo'} />;
  const title = product.names?.en ?? '';
  return <InstallMarketArtifactCard title={title} preview={preview} open={() => open(product)}></InstallMarketArtifactCard>;
};
