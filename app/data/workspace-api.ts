import { toast } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { headers, ok } from './custom-fetch';
import {
  createWorkspace as createWorkspaceReq,
  deleteWorkspace as deleteWorkspaceReq,
  exportWorkspace as exportWorkspaceReq,
  importWorkspace as importWorkspaceReq,
  installMarketProduct,
  type WorkspaceBean,
  type WorkspaceInit,
  workspaces
} from './generated/openapi-default';
import { deploy } from './generated/openapi-system';
import { ProjectIdentifier } from './project-api';

export type Workspace = WorkspaceBean;

export type DeployParams = { workspaceId: string; applicationName: string; engineUrl: string; user: string; password: string };

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
    return;
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

export const useDeployWorkspace = () => {
  const { exportWorkspace } = useExportWorkspace();
  const deployWorkspace = async (params: DeployParams) => {
    const zip = await exportWorkspace(params.workspaceId);
    if (!(zip instanceof Blob)) {
      throw new Error(`Failed to export workspace '${params.workspaceId}'`);
    }
    const fileToDeploy = new File([zip], 'export.zip');
    const baseUrl = new URL('system', params.engineUrl).toString();
    const basicAuth = 'Basic ' + btoa(params.user + ':' + params.password);
    const reqHeaders = {
      'Content-Type': 'multipart/form-data',
      Authorization: basicAuth,
      ...headers(baseUrl)
    };
    const res = await deploy(params.applicationName, { fileToDeploy }, { headers: reqHeaders });
    if (ok(res)) {
      return res.data as unknown as string;
    }
    throw new Error(`Failed to deploy workspace '${params.workspaceId}'`);
  };
  return {
    deployWorkspace: (params: DeployParams) => {
      const deploy = deployWorkspace(params);
      toast.promise(deploy, {
        loading: 'Deploy workspace',
        success: 'Workspace deployed',
        error: e => e.message
      });
      return deploy;
    }
  };
};

export const useInstallProduct = () => {
  const installProduct = async (id: string, productJson: string, project?: ProjectIdentifier) => {
    const res = await installMarketProduct(id, { productJson, project });
    if (ok(res)) {
      return;
    }
    throw new Error('Failed to install market product');
  };
  return {
    installProduct: (id: string, json: string, project?: ProjectIdentifier) => {
      const install = installProduct(id, json, project);
      toast.promise(() => install, {
        loading: 'Install market product',
        success: 'Product installed',
        error: e => e.message
      });
    }
  };
};
