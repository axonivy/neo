export const projectSort = (a: string, b: string, workspace?: string) => {
  if (a === workspace) return -1;
  if (b === workspace) return 1;
  return a.localeCompare(b);
};
