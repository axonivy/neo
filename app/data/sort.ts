import type { WorkspaceBean } from './generated/openapi-default';

export const projectSort = (a: string, b: string, ws?: WorkspaceBean) => {
  if (a === ws?.name) return -1;
  if (b === ws?.name) return 1;
  return a.localeCompare(b);
};
