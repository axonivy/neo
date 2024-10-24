import * as fs from 'fs';
import * as path from 'path';

export const app = process.env.WORKSPACE ? 'ivy-dev-neo-test-project' : 'designer';
export const workspace = process.env.WORKSPACE ?? 'designer';
export const workspaceExportDir = path.join('playwright', 'wsExport');
export const workspaceExportZip = (file: string) => path.join(workspaceExportDir, file);
export const rmWorkspaceExportDir = () => {
  if (fs.existsSync(workspaceExportDir)) {
    fs.rm(workspaceExportDir, { recursive: true }, () => {});
  }
};
