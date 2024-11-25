import { useSearchParams } from 'react-router';

export const useSearch = () => {
  const name = 'search';
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    search: searchParams.get(name) ?? '',
    setSearch: (change: string) => {
      if (change) {
        searchParams.set(name, change);
      } else {
        searchParams.delete(name);
      }
      setSearchParams(searchParams, { replace: true });
    }
  };
};
