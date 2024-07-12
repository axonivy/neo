import { toast } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ok } from './custom-fetch';
import { createWorkspace as createWorkspaceReq, deleteWorkspace as deleteWorkspaceReq, workspaces } from './generated/openapi-dev';

export type Workspace = {
  id: string;
  name: string;
  baseUrl: string;
  running: boolean;
};

type WorkspaceInit = {
  name: string;
};

const queryKey = ['neo', 'workspaces'];

export const useWorkspaces = () => {
  return useQuery({
    queryKey,
    queryFn: () =>
      workspaces().then(res => {
        if (ok(res)) {
          return res.data as Array<Workspace>;
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
      return res.data as Workspace;
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
