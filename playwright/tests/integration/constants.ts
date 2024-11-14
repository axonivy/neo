import * as fs from 'fs';
import * as path from 'path';

export const TEST_PROJECT = 'neo-test-project';
export const APP = process.env.WORKSPACE ? `Developer-${TEST_PROJECT}` : 'designer';
export const WORKSPACE = process.env.WORKSPACE ?? 'designer';
export const WORKSPACE_EXPORT_DIR = path.join('playwright', 'wsExport');
export const workspaceExportZip = (file: string) => path.join(WORKSPACE_EXPORT_DIR, file);
export const rmWorkspaceExportDir = () => {
  if (fs.existsSync(WORKSPACE_EXPORT_DIR)) {
    fs.rm(WORKSPACE_EXPORT_DIR, { recursive: true }, () => {});
  }
};
