export function groupArtifacts<T>(artifacts: T[], resolveKey: (t: T) => string) {
  return artifacts.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = resolveKey(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}

export const groupSort = (a: string, b: string, baseProject: string) => {
  if (a === baseProject) return -1;
  if (b === baseProject) return 1;
  return a.localeCompare(b);
};
