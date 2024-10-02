export function groupArtifacts<T>(artifacts: T[], resolveKey: (t: T) => string) {
  return artifacts.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = resolveKey(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}

export function insertWorkspaceIfAbsent<T>(record: Record<string, T[]>, workspace?: string) {
  if (workspace && record[workspace] === undefined) {
    record[workspace] = [];
  }
}

export const groupSort = (a: string, b: string, workspace?: string) => {
  if (a === workspace) return -1;
  if (b === workspace) return 1;
  return a.localeCompare(b);
};
