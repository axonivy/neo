type ProjectGroup<T> = {
  project: string;
  artifacts: T[];
};

export function insertWorkspaceIfAbsent<T>(groups: ProjectGroup<T>[], workspace?: string) {
  if (workspace && groups?.find(({ project }) => project === workspace) === undefined) {
    return [{ project: workspace, artifacts: [] }, ...groups];
  }
  return groups;
}

export function filterArifacts<T>(groups: ProjectGroup<T>[], filter: (artifact: T) => boolean) {
  return groups.map(({ project, artifacts }) => {
    const filteredArtifacts = artifacts.filter(proc => filter(proc));
    return { project, artifacts: filteredArtifacts };
  });
}
