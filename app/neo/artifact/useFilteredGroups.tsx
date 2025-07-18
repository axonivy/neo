import { useMemo } from 'react';
import { useWorkspace } from '~/data/workspace-api';
import { useOverviewFilter } from '../overview/OverviewFilter';

type ProjectGroup<T> = {
  project: string;
  artifacts: T[];
};

export function useFilteredGroups<T>(groups: ProjectGroup<T>[], artifactSearchTarget: (t: T) => string) {
  const ws = useWorkspace();
  const overviewFilter = useOverviewFilter();
  const extendedGroups = useMemo(() => insertWorkspaceIfAbsent(groups ?? [], ws?.name), [groups, ws?.name]);
  const filteredGroups = useMemo(
    () =>
      filterArifacts(
        extendedGroups,
        t => artifactSearchTarget(t).toLocaleLowerCase().includes(overviewFilter.search.toLocaleLowerCase()),
        ws?.name
      ),
    [artifactSearchTarget, extendedGroups, overviewFilter.search, ws]
  );
  return { filteredGroups, overviewFilter };
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
