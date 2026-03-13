import type { WorkspaceBean } from './generated/ivy-client';

export const projectSort = (a: string, b: string, ws?: WorkspaceBean) => {
  if (a === ws?.id) return -1;
  if (b === ws?.id) return 1;
  return a.localeCompare(b);
};
