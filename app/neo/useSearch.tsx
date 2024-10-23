import { useSearchParams } from '@remix-run/react';
import { useState } from 'react';

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  return {
    search,
    setSearch: (change: string) => {
      setSearch(change);
      setSearchParams({ search: change }, { replace: true });
    }
  };
};
