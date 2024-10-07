import * as fs from 'fs';
import * as path from 'path';

export const app = process.env.WORKSPACE ? 'ivy-dev-test-ws' : 'designer';
export const workspace = process.env.WORKSPACE ?? 'testee';
export const workspaceExportDir = path.join('playwright', 'wsExport');
export const workspaceExportZip = (file: string) => path.join(workspaceExportDir, file);
export const rmWorkspaceExportDir = () => {
  if (fs.existsSync(workspaceExportDir)) {
    fs.rm(workspaceExportDir, { recursive: true }, () => {});
  }
};
