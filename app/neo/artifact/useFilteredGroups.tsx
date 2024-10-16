import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';

type ProjectGroup<T> = {
  project: string;
  artifacts: T[];
};

export function useFilteredGroups<T>(groups: ProjectGroup<T>[], artifactSearchTarget: (t: T) => string) {
  const { ws } = useParams();
  const [search, setSearch] = useState('');
  const extendedGroups = useMemo(() => insertWorkspaceIfAbsent(groups ?? [], ws), [groups, ws]);
  const filteredGroups = useMemo(
    () => filterArifacts(extendedGroups, t => artifactSearchTarget(t).toLocaleLowerCase().includes(search.toLocaleLowerCase()), ws),
    [artifactSearchTarget, extendedGroups, search, ws]
  );
  return { filteredGroups, search, setSearch };
}

function insertWorkspaceIfAbsent<T>(groups: ProjectGroup<T>[], workspace?: string) {
  if (workspace && groups?.find(({ project }) => project === workspace) === undefined) {
    return [{ project: workspace, artifacts: [] }, ...groups];
  }
  return groups;
}

function filterArifacts<T>(groups: ProjectGroup<T>[], filter: (artifact: T) => boolean, workspace?: string) {
  return groups
    .map(({ project, artifacts }) => {
      const filteredArtifacts = artifacts.filter(proc => filter(proc));
      return { project, artifacts: filteredArtifacts };
    })
    .filter(({ project, artifacts }) => artifacts.length > 0 || project === workspace);
}
