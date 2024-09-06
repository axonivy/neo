import type { MetaFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { ProductModel } from '~/data/generated/openapi-market';
import { useProducts } from '~/data/market-api';
import { ArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
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
    <Overview title='Market Products' search={search} onSearchChange={setSearch} isPending={isPending}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Overview>
  );
}

export const ProductCard = ({ product }: { product: ProductModel }) => {
  const open = () => {};
  const preview = <img src={product.logoUrl} width={100} alt={'product logo'} />;
  return <ArtifactCard name={product.names?.en ?? ''} type='product' preview={preview} onClick={open} />;
};
