import { useSearchParams } from 'react-router';

const QUERY_KEY = 'q';
const PROJECTS_KEY = 'p';
const TAGS_KEY = 't';

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
    tags: searchParams.getAll(TAGS_KEY) ?? [],
    setTags: (tags: Array<string>) => {
      searchParams.delete(TAGS_KEY);
      tags.forEach(tags => searchParams.append(TAGS_KEY, tags));
      setSearchParams(searchParams, { replace: true });
    }
  };
};
