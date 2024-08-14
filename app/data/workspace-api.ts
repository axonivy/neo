import { toast } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ok } from './custom-fetch';
import {
  createWorkspace as createWorkspaceReq,
  deleteWorkspace as deleteWorkspaceReq,
  exportWorkspace as exportWorkspaceReq,
  importWorkspace as importWorkspaceReq,
  type WorkspaceBean,
  type WorkspaceInit,
  workspaces
} from './generated/openapi-default';

export type Workspace = WorkspaceBean;

const queryKey = ['neo', 'workspaces'];

export const useWorkspaces = () => {
  return useQuery({
    queryKey,
    queryFn: () =>
      workspaces().then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error('Failed to load workspaces', { description: 'Maybe the server is not correclty started' });
        return [];
      })
  });
};

export const useWorkspace = () => {
  const { ws } = useParams();
  const workspaces = useWorkspaces();
  if (!ws) {
    throw new Error('Workspace not found');
  }
  return workspaces.data?.find(w => w.id === ws);
};

export const useDeleteWorkspace = () => {
  const client = useQueryClient();
  const deleteWorkspace = async (id: string) => {
    const res = await deleteWorkspaceReq(id);
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return;
    }
    throw new Error(`Failed to remove from '${id}'`);
  };
  return {
    deleteWorkspace: (id: string) =>
      toast.promise(() => deleteWorkspace(id), { loading: 'Delete workspace', success: 'Workspace deleted', error: e => e.message })
  };
};

export const useCreateWorkspace = () => {
  const client = useQueryClient();
  const createWorkspace = async (workspaceInit: WorkspaceInit) => {
    const res = await createWorkspaceReq(workspaceInit);
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error('Failed to create workspace');
  };
  return {
    createWorkspace: (workspaceInit: WorkspaceInit) => {
      const workspace = createWorkspace(workspaceInit);
      toast.promise(() => workspace, { loading: 'Creating workspace', success: 'Workspace created', error: e => e.message });
      return workspace;
    }
  };
};

export const useExportWorkspace = () => {
  const exportWorkspace = async (id: string) => {
    const res = await exportWorkspaceReq(id);
    if (ok(res)) {
      return res.data;
    }
    throw new Error(`Failed to export workspace '${id}'`);
  };
  return {
    exportWorkspace: (id: string) => {
      const zip = exportWorkspace(id);
      toast.promise(() => zip, { loading: 'Export workspace', success: 'Workspace exported', error: e => e.message });
      return zip;
    }
  };
};

export const useImportWorkspace = () => {
  const importWorkspace = async (id: string, file: Blob, fileName: string) => {
    const res = await importWorkspaceReq(id, { file, fileName }, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (ok(res)) {
      return;
    }
    throw new Error(`Failed to import workspace '${id}'`);
  };
  return {
    importWorkspace: (id: string, file: Blob, fileName: string) => {
      const importWs = importWorkspace(id, file, fileName);
      toast.promise(() => importWs, {
        loading: 'Import workspace',
        success: 'Workspace imported',
        error: e => e.message
      });
      return importWs;
    }
  };
};
