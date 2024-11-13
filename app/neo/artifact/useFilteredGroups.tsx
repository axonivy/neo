import { useMemo } from 'react';
import { useWorkspace } from '~/data/workspace-api';
import { useSearch } from '../useSearch';

type ProjectGroup<T> = {
  project: string;
  artifacts: T[];
};

export function useFilteredGroups<T>(groups: ProjectGroup<T>[], artifactSearchTarget: (t: T) => string) {
  const ws = useWorkspace();
  const { search, setSearch } = useSearch();
  const extendedGroups = useMemo(() => insertWorkspaceIfAbsent(groups ?? [], ws?.name), [groups, ws?.name]);
  const filteredGroups = useMemo(
    () => filterArifacts(extendedGroups, t => artifactSearchTarget(t).toLocaleLowerCase().includes(search.toLocaleLowerCase()), ws?.name),
    [artifactSearchTarget, extendedGroups, search, ws]
  );
  return { filteredGroups, search, setSearch };
}

function insertWorkspaceIfAbsent<T>(groups: ProjectGroup<T>[], wsName?: string) {
  if (wsName && groups?.find(({ project }) => project === wsName) === undefined) {
    return [{ project: wsName, artifacts: [] }, ...groups];
  }
  return groups;
}

function filterArifacts<T>(groups: ProjectGroup<T>[], filter: (artifact: T) => boolean, wsName?: string) {
  return groups
    .map(({ project, artifacts }) => {
      const filteredArtifacts = artifacts.filter(proc => filter(proc));
      return { project, artifacts: filteredArtifacts };
    })
    .filter(({ project, artifacts }) => artifacts.length > 0 || project === wsName);
}
