import { toast } from '@axonivy/ui-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { headers, ok, resolveErrorMessage } from './custom-fetch';
import {
  createWorkspace as createWorkspaceReq,
  deleteWorkspace as deleteWorkspaceReq,
  deploy,
  exportWorkspace as exportWorkspaceReq,
  importProjects as importProjectsReq,
  installMarketProduct,
  type WorkspaceBean,
  type WorkspaceInit,
  workspaces
} from './generated/ivy-client';
import type { ProjectIdentifier } from './project-api';

export type Workspace = WorkspaceBean;

export type DeployParams = { workspaceId: string; applicationName: string; engineUrl: string; user: string; password: string };

const queryKey = ['neo', 'workspaces'];

export const useWorkspaces = () => {
  const { t } = useTranslation();
  return useQuery({
    queryKey,
    queryFn: () =>
      workspaces().then(res => {
        if (ok(res)) {
          return res.data;
        }
        toast.error(t('toast.workspace.missing'), { description: t('toast.serverStatus') });
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
  const { t } = useTranslation();
  const client = useQueryClient();
  const deleteWorkspace = async (id: string) => {
    const res = await deleteWorkspaceReq(id);
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return;
    }
    throw new Error(t('toast.workspace.removeFail', { id: id }));
  };
  return {
    deleteWorkspace: (id: string) =>
      toast.promise(() => deleteWorkspace(id), {
        loading: t('toast.workspace.removing'),
        success: t('toast.workspace.removed'),
        error: e => e.message
      })
  };
};

export const useCreateWorkspace = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const createWorkspace = async (workspaceInit: WorkspaceInit) => {
    const res = await createWorkspaceReq(workspaceInit);
    if (ok(res)) {
      client.invalidateQueries({ queryKey });
      return res.data;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.workspace.createFail')));
  };
  return {
    createWorkspace: (workspaceInit: WorkspaceInit) => {
      const workspace = createWorkspace(workspaceInit);
      toast.promise(() => workspace, {
        loading: t('toast.workspace.creating'),
        success: t('toast.workspace.created'),
        error: e => e.message
      });
      return workspace;
    }
  };
};

export const useExportWorkspace = () => {
  const { t } = useTranslation();
  const exportWorkspace = async (id: string) => {
    const res = await exportWorkspaceReq(id);
    if (ok(res)) {
      return res.data;
    }
    throw new Error(t('toast.workspace.exportFail', { id: id }));
  };
  return {
    exportWorkspace: (id: string) => {
      const zip = exportWorkspace(id);
      toast.promise(() => zip, { loading: t('toast.workspace.exporting'), success: t('toast.workspace.exported'), error: e => e.message });
      return zip;
    }
  };
};

export const useImportProjectsIntoWs = () => {
  const { t } = useTranslation();
  const importProjects = async (id: string, file: Blob, dependentProject?: ProjectIdentifier) => {
    const blob = dependentProject ? new Blob([JSON.stringify(dependentProject)], { type: 'application/json' }) : undefined;
    const res = await importProjectsReq(id, { file, dependentProject: blob });
    if (ok(res)) {
      return;
    }
    throw new Error(resolveErrorMessage(res.data, t('toast.workspace.importFail', { id: id })));
  };
  return {
    importProjects: (id: string, file: Blob, dependentProject?: ProjectIdentifier) => {
      const importPromise = importProjects(id, file, dependentProject);
      toast.promise(() => importPromise, {
        loading: t('toast.workspace.importing'),
        success: t('toast.workspace.imported'),
        error: e => e.message
      });
      return importPromise;
    }
  };
};

export const useDeployWorkspace = () => {
  const { t } = useTranslation();
  const { exportWorkspace } = useExportWorkspace();
  const deployWorkspace = async (params: DeployParams) => {
    const zip = await exportWorkspace(params.workspaceId);
    if (!(zip instanceof Blob)) {
      throw new Error(t('toast.workspace.exportFail', { id: params.workspaceId }));
    }
    const fileToDeploy = new File([zip], 'export.zip');
    const baseUrl = new URL('system', params.engineUrl).toString();
    const basicAuth = 'Basic ' + btoa(params.user + ':' + params.password);
    const reqHeaders = { Authorization: basicAuth, ...headers(baseUrl) };
    const res = await deploy(params.applicationName, { fileToDeploy }, { headers: reqHeaders });
    if (ok(res)) {
      return res.data as unknown as string;
    }
    throw new Error(t('toast.workspace.deployFail', { id: params.workspaceId }));
  };
  return {
    deployWorkspace: (params: DeployParams) => {
      const deploy = deployWorkspace(params);
      toast.promise(deploy, { loading: t('toast.workspace.deploying'), success: t('toast.workspace.deployed'), error: e => e.message });
      return deploy;
    }
  };
};

export const useInstallProduct = () => {
  const { t } = useTranslation();
  const installProduct = async (id: string, productJson: string, dependentProject?: ProjectIdentifier) => {
    const res = await installMarketProduct(id, { productJson, dependentProject });
    if (ok(res)) {
      return res.data;
    }
    throw new Error(t('toast.workspace.marketInstallFail'));
  };
  return {
    installProduct: (id: string, json: string, project?: ProjectIdentifier) => {
      const installResult = installProduct(id, json, project);
      toast.promise(() => installResult, {
        loading: t('toast.workspace.marketProductInstalling'),
        success: res => t('toast.workspace.marketProductInstalled', { projects: res.installedProjects.map(p => p.pmv).join(', ') }),
        error: e => e.message
      });
      return installResult;
    }
  };
};
