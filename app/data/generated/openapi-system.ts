/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Axon Ivy
 */
import { customFetch } from '../custom-fetch';
export type DeployBody = {
  /** deployment options as YAML file. If defined, the specific params below will be ignored. */
  deploymentOptions?: string;
  deployTestUsers?: string;
  /** project .iar file or multiple projects in a .zip file */
  fileToDeploy: Blob;
  targetFileFormat?: string;
  targetState?: string;
  targetVersion?: string;
};

export type SetVariableParams = {
  /**
   * new value for variable
   */
  value?: string;
};

export type SetConfigParams = {
  /**
   * new value for config
   */
  value?: string;
};

/**
 * Returns the value of the config with the given name.
 */
export type getConfigResponse = {
  data: void;
  status: number;
  headers: Headers;
};

export const getGetConfigUrl = (applicationName: string, configKey: string) => {
  return `/apps/${applicationName}/configs/${configKey}`;
};

export const getConfig = async (applicationName: string, configKey: string, options?: RequestInit): Promise<getConfigResponse> => {
  return customFetch<Promise<getConfigResponse>>(getGetConfigUrl(applicationName, configKey), {
    ...options,
    method: 'GET'
  });
};

/**
 * Sets a new value for the config with the given name.
 */
export type setConfigResponse = {
  data: void;
  status: number;
  headers: Headers;
};

export const getSetConfigUrl = (applicationName: string, configKey: string, params?: SetConfigParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString());
    }
  });

  return normalizedParams.size
    ? `/apps/${applicationName}/configs/${configKey}?${normalizedParams.toString()}`
    : `/apps/${applicationName}/configs/${configKey}`;
};

export const setConfig = async (
  applicationName: string,
  configKey: string,
  setConfigBody: string,
  params?: SetConfigParams,
  options?: RequestInit
): Promise<setConfigResponse> => {
  return customFetch<Promise<setConfigResponse>>(getSetConfigUrl(applicationName, configKey, params), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': '*/*', ...options?.headers },
    body: JSON.stringify(setConfigBody)
  });
};

/**
 * Resets the config with the given name to the default value.
 */
export type resetConfigResponse = {
  data: void;
  status: number;
  headers: Headers;
};

export const getResetConfigUrl = (applicationName: string, configKey: string) => {
  return `/apps/${applicationName}/configs/${configKey}`;
};

export const resetConfig = async (applicationName: string, configKey: string, options?: RequestInit): Promise<resetConfigResponse> => {
  return customFetch<Promise<resetConfigResponse>>(getResetConfigUrl(applicationName, configKey), {
    ...options,
    method: 'DELETE'
  });
};

/**
 * Returns the value of the variable with the given name.
 */
export type getVariableResponse = {
  data: void;
  status: number;
  headers: Headers;
};

export const getGetVariableUrl = (applicationName: string, variableName: string) => {
  return `/apps/${applicationName}/variables/${variableName}`;
};

export const getVariable = async (applicationName: string, variableName: string, options?: RequestInit): Promise<getVariableResponse> => {
  return customFetch<Promise<getVariableResponse>>(getGetVariableUrl(applicationName, variableName), {
    ...options,
    method: 'GET'
  });
};

/**
 * Sets a new value for the variable with the given name.
 */
export type setVariableResponse = {
  data: void;
  status: number;
  headers: Headers;
};

export const getSetVariableUrl = (applicationName: string, variableName: string, params?: SetVariableParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString());
    }
  });

  return normalizedParams.size
    ? `/apps/${applicationName}/variables/${variableName}?${normalizedParams.toString()}`
    : `/apps/${applicationName}/variables/${variableName}`;
};

export const setVariable = async (
  applicationName: string,
  variableName: string,
  setVariableBody: string,
  params?: SetVariableParams,
  options?: RequestInit
): Promise<setVariableResponse> => {
  return customFetch<Promise<setVariableResponse>>(getSetVariableUrl(applicationName, variableName, params), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': '*/*', ...options?.headers },
    body: JSON.stringify(setVariableBody)
  });
};

/**
 * Resets the variable with the given name to the default value.
 */
export type resetVariableResponse = {
  data: void;
  status: number;
  headers: Headers;
};

export const getResetVariableUrl = (applicationName: string, variableName: string) => {
  return `/apps/${applicationName}/variables/${variableName}`;
};

export const resetVariable = async (
  applicationName: string,
  variableName: string,
  options?: RequestInit
): Promise<resetVariableResponse> => {
  return customFetch<Promise<resetVariableResponse>>(getResetVariableUrl(applicationName, variableName), {
    ...options,
    method: 'DELETE'
  });
};

/**
 * Deploys a project .iar file or multiple projects in a .zip file to an application.
 */
export type deployResponse = {
  data: void;
  status: number;
  headers: Headers;
};

export const getDeployUrl = (applicationName: string) => {
  return `/apps/${applicationName}`;
};

export const deploy = async (applicationName: string, deployBody: DeployBody, options?: RequestInit): Promise<deployResponse> => {
  const formData = new FormData();
  formData.append('fileToDeploy', deployBody.fileToDeploy);
  if (deployBody.deploymentOptions !== undefined) {
    formData.append('deploymentOptions', deployBody.deploymentOptions);
  }
  if (deployBody.deployTestUsers !== undefined) {
    formData.append('deployTestUsers', deployBody.deployTestUsers);
  }
  if (deployBody.targetVersion !== undefined) {
    formData.append('targetVersion', deployBody.targetVersion);
  }
  if (deployBody.targetState !== undefined) {
    formData.append('targetState', deployBody.targetState);
  }
  if (deployBody.targetFileFormat !== undefined) {
    formData.append('targetFileFormat', deployBody.targetFileFormat);
  }

  return customFetch<Promise<deployResponse>>(getDeployUrl(applicationName), {
    ...options,
    method: 'POST',
    body: formData
  });
};
