export function insertWorkspaceIfAbsent<T>(record: Record<string, T[]>, workspace?: string) {
  if (workspace && record[workspace] === undefined) {
    record[workspace] = [];
  }
}

export const projectSort = (a: string, b: string, workspace?: string) => {
  if (a === workspace) return -1;
  if (b === workspace) return 1;
  return a.localeCompare(b);
};
