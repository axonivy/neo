import { useSearchParams } from '@remix-run/react';

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    search: searchParams.get('search') ?? '',
    setSearch: (change: string) => {
      setSearchParams({ search: change }, { replace: true });
    }
  };
};
