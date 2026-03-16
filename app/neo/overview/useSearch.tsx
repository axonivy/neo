import { useSearchParams } from 'react-router';

const QUERY_KEY = 'q';
const PROJECTS_KEY = 'p';
const BADGES_KEY = 'b';
const TYPES_KEY = 't';

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    search: searchParams.get(QUERY_KEY) ?? '',
    setSearch: (search: string) => {
      searchParams.delete(QUERY_KEY);
      if (search) {
        searchParams.set(QUERY_KEY, search);
      }
      setSearchParams(searchParams, { replace: true });
    },
    projects: searchParams.getAll(PROJECTS_KEY) ?? [],
    setProjects: (projects: Array<string>) => {
      searchParams.delete(PROJECTS_KEY);
      projects.forEach(project => searchParams.append(PROJECTS_KEY, project));
      setSearchParams(searchParams, { replace: true });
    },
    badges: searchParams.getAll(BADGES_KEY) ?? [],
    setBadges: (badges: Array<string>) => {
      searchParams.delete(BADGES_KEY);
      badges.forEach(badges => searchParams.append(BADGES_KEY, badges));
      setSearchParams(searchParams, { replace: true });
    },
    types: searchParams.getAll(TYPES_KEY) ?? [],
    setTypes: (types: Array<string>) => {
      searchParams.delete(TYPES_KEY);
      types.forEach(type => searchParams.append(TYPES_KEY, type));
      setSearchParams(searchParams, { replace: true });
    }
  };
};
