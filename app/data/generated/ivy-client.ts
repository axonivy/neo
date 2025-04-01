/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * Axon Ivy OpenAPI
 */
import { customFetch } from '../custom-fetch';
export type WebNotificationOperationOperation = (typeof WebNotificationOperationOperation)[keyof typeof WebNotificationOperationOperation];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WebNotificationOperationOperation = {
  MARK_AS_READ: 'MARK_AS_READ'
} as const;

export interface WebNotificationOperation {
  operation?: WebNotificationOperationOperation;
}

export interface WebNotificationActionBean {
  link?: string;
  title?: string;
}

export interface WebNotificationBean {
  uuid?: string;
  createdAt?: string;
  read?: boolean;
  message?: string;
  details?: WebNotificationActionBean;
  start?: WebNotificationActionBean;
}

export interface UserBean {
  uuid?: string;
  name?: string;
  fullName?: string;
  emailAddress?: string;
  language?: string;
}

export interface EngineInfo {
  version?: string;
  engineName?: string;
  minimumSupportedMobileAppVersion?: string;
}

export interface ConfigurationIdentifier {
  path: string;
  project: ProjectIdentifier;
}

export interface ProjectIdentifier {
  app: string;
  pmv: string;
  isIar?: boolean;
}

export interface ConfigurationBean {
  id: ConfigurationIdentifier;
  content: string;
}

export interface DataClassBean {
  name: string;
  simpleName: string;
  dataClassIdentifier: DataClassIdentifier;
  path: string;
  fields: DataClassField[];
  isEntityClass: boolean;
  isBusinessCaseData: boolean;
}

export interface DataClassField {
  name: string;
  type: string;
}

export interface DataClassIdentifier {
  project: ProjectIdentifier;
  name: string;
}

export interface DataClassInit {
  name: string;
  project?: ProjectIdentifier;
  projectDir?: string;
}

export interface FormIdentifier {
  project: ProjectIdentifier;
  id: string;
}

export interface HdBean {
  identifier: FormIdentifier;
  name: string;
  namespace?: string;
  path: string;
  type?: string;
  uri?: string;
}

export interface HdInit {
  namespace: string;
  name: string;
  type?: string;
  template?: string;
  layout?: string;
  projectDir?: string;
  pid?: string;
  project?: ProjectIdentifier;
  dataClass?: DataClassIdentifier;
}

export type ProcessBeanKind = (typeof ProcessBeanKind)[keyof typeof ProcessBeanKind];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ProcessBeanKind = {
  NORMAL: 'NORMAL',
  WEB_SERVICE: 'WEB_SERVICE',
  CALLABLE_SUB: 'CALLABLE_SUB',
  HTML_DIALOG: 'HTML_DIALOG'
} as const;

export interface ProcessBean {
  name: string;
  namespace: string;
  processIdentifier: ProcessIdentifier;
  path?: string;
  requestPath?: string;
  processGroup?: string;
  kind: ProcessBeanKind;
  type?: string;
  uri?: string;
}

export interface ProcessIdentifier {
  project: ProjectIdentifier;
  pid: string;
}

export interface ProcessInit {
  name: string;
  namespace: string;
  path?: string;
  kind: string;
  pid?: string;
  project?: ProjectIdentifier;
}

export interface ProjectBean {
  artifactId: string;
  groupId: string;
  id: ProjectIdentifier;
  version: string;
  isDeletable: boolean;
  defaultNamespace: string;
  dependencies: ProjectIdentifier[];
}

export interface NewProjectParams {
  name?: string;
  groupId?: string;
  projectId?: string;
  defaultNamespace?: string;
  path?: string;
}

export interface ProjectParams {
  name?: string;
  path?: string;
}

export interface WorkspaceBean {
  id: string;
  name: string;
  baseUrl: string;
  running: boolean;
}

export interface WorkspaceInit {
  name: string;
  path?: string;
}

export interface MarketInstallResult {
  installedProjects: ProjectIdentifier[];
  demoProcesses: ProcessBean[];
}

export interface ProductInstallParams {
  productJson: string;
  dependentProject?: ProjectIdentifier;
}

export interface AggBean {
  [key: string]: unknown;
}

export interface DocumentBean {
  id?: number;
  name?: string;
  url?: string;
  path?: string;
}

export interface MessageBean {
  message?: string;
  statusCode?: number;
  document?: DocumentBean;
}

export interface ProcessStartBean {
  id?: number;
  name?: string;
  description?: string;
  activatorName?: string;
  fullRequestPath?: string;
}

export interface StartCustomFieldBean {
  name?: string;
  value?: string;
}

export interface WebStartableBean {
  id?: string;
  name?: string;
  description?: string;
  activatorName?: string;
  fullRequestPath?: string;
  customFields?: StartCustomFieldBean[];
}

export interface CaseBean {
  id?: number;
  name?: string;
  description?: string;
  documents?: DocumentBean[];
}

export interface ResponsibleBean {
  name?: string;
}

export interface TaskBean {
  id?: number;
  name?: string;
  description?: string;
  startTimeStamp?: string;
  expiryTimeStamp?: string;
  priority?: number;
  state?: number;
  activatorName?: string;
  responsibles?: ResponsibleBean[];
  fullRequestPath?: string;
  offline?: boolean;
  case?: CaseBean;
}

/**
 * The geographic coordinate of the location
 */
export interface GeoPositionBean {
  /** Latitute in degree (south) -90.0d..+90.0d (north) */
  latitude?: number;
  /** Longitude in degree (west) -180.0d..+180.0d (east) */
  longitude?: number;
  /** Altitude in meters */
  altitude?: number;
}

export interface LocationBean {
  /** The name of the location, e.g., Zug, Wien */
  name?: string;
  /** The type of the location, e.g., UserPosition, HeadQuarter, BranchOffice */
  type?: string;
  /** Additional note */
  note?: string;
  /** The address of the location, e.g., Baarerstrasse 12;6403 Zug;Switzerland */
  address?: string;
  /** The timestamp when the location was created or updated */
  timestamp?: string;
  position?: GeoPositionBean;
}

export type SetConfigParams = {
  /**
   * new value for config
   */
  value?: string;
};

export type SetVariableParams = {
  /**
   * new value for variable
   */
  value?: string;
};

export type DeployBody = {
  /** project .iar file or multiple projects in a .zip file */
  fileToDeploy: Blob;
  /** deployment options as YAML file. If defined, the specific params below will be ignored. */
  deploymentOptions?: string;
  deployTestUsers?: string;
  targetVersion?: string;
  targetState?: string;
  targetFileFormat?: string;
};

export type ReadConfigParams = {
  path?: string;
  app?: string;
  pmv?: string;
};

export type DeleteProjectParams = {
  projectDir?: string;
  app?: string;
  pmv?: string;
};

export type StopBpmEngineParams = {
  app?: string;
  pmv?: string;
  projectDir?: string;
};

export type ImportProjectsBody = {
  file?: Blob;
  dependentProject?: Blob;
};

/**
 * Returns the value of the config with the given name.
 */
export type getConfigResponse = {
  data: void | void;
  status: number;
  headers: Headers;
};

export const getGetConfigUrl = (applicationName: string, configKey: string) => {
  return `/apps/${applicationName}/configs/${configKey}`;
};

export const getConfig = async (applicationName: string, configKey: string, options?: RequestInit): Promise<getConfigResponse> => {
  return customFetch<getConfigResponse>(getGetConfigUrl(applicationName, configKey), {
    ...options,
    method: 'GET'
  });
};

/**
 * Sets a new value for the config with the given name.
 */
export type setConfigResponse = {
  data: void | void;
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
  return customFetch<setConfigResponse>(getSetConfigUrl(applicationName, configKey, params), {
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
  data: void | void;
  status: number;
  headers: Headers;
};

export const getResetConfigUrl = (applicationName: string, configKey: string) => {
  return `/apps/${applicationName}/configs/${configKey}`;
};

export const resetConfig = async (applicationName: string, configKey: string, options?: RequestInit): Promise<resetConfigResponse> => {
  return customFetch<resetConfigResponse>(getResetConfigUrl(applicationName, configKey), {
    ...options,
    method: 'DELETE'
  });
};

/**
 * Returns the value of the variable with the given name.
 */
export type getVariableResponse = {
  data: void | void;
  status: number;
  headers: Headers;
};

export const getGetVariableUrl = (applicationName: string, variableName: string) => {
  return `/apps/${applicationName}/variables/${variableName}`;
};

export const getVariable = async (applicationName: string, variableName: string, options?: RequestInit): Promise<getVariableResponse> => {
  return customFetch<getVariableResponse>(getGetVariableUrl(applicationName, variableName), {
    ...options,
    method: 'GET'
  });
};

/**
 * Sets a new value for the variable with the given name.
 */
export type setVariableResponse = {
  data: void | void;
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
  return customFetch<setVariableResponse>(getSetVariableUrl(applicationName, variableName, params), {
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
  data: void | void;
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
  return customFetch<resetVariableResponse>(getResetVariableUrl(applicationName, variableName), {
    ...options,
    method: 'DELETE'
  });
};

/**
 * Deploys a project .iar file or multiple projects in a .zip file to an application.
 */
export type deployResponse = {
  data: void | void;
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

  return customFetch<deployResponse>(getDeployUrl(applicationName), {
    ...options,
    method: 'POST',
    body: formData
  });
};

/**
 * Returns the version and the name of the engine
 */
export type getInfoResponse = {
  data: EngineInfo | EngineInfo;
  status: number;
  headers: Headers;
};

export const getGetInfoUrl = () => {
  return `/engine/info`;
};

export const getInfo = async (options?: RequestInit): Promise<getInfoResponse> => {
  return customFetch<getInfoResponse>(getGetInfoUrl(), {
    ...options,
    method: 'GET'
  });
};

export type configurationsResponse = {
  data: ConfigurationIdentifier[] | ConfigurationIdentifier[];
  status: number;
  headers: Headers;
};

export const getConfigurationsUrl = () => {
  return `/web-ide/configurations`;
};

export const configurations = async (options?: RequestInit): Promise<configurationsResponse> => {
  return customFetch<configurationsResponse>(getConfigurationsUrl(), {
    ...options,
    method: 'GET'
  });
};

export type readConfigResponse = {
  data: ConfigurationBean | ConfigurationBean;
  status: number;
  headers: Headers;
};

export const getReadConfigUrl = (params?: ReadConfigParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString());
    }
  });

  return normalizedParams.size ? `/web-ide/configuration?${normalizedParams.toString()}` : `/web-ide/configuration`;
};

export const readConfig = async (params?: ReadConfigParams, options?: RequestInit): Promise<readConfigResponse> => {
  return customFetch<readConfigResponse>(getReadConfigUrl(params), {
    ...options,
    method: 'GET'
  });
};

export type writeConfigResponse = {
  data: ConfigurationBean | ConfigurationBean;
  status: number;
  headers: Headers;
};

export const getWriteConfigUrl = () => {
  return `/web-ide/configuration`;
};

export const writeConfig = async (configurationBean: ConfigurationBean, options?: RequestInit): Promise<writeConfigResponse> => {
  return customFetch<writeConfigResponse>(getWriteConfigUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(configurationBean)
  });
};

export type dataClassesResponse = {
  data: DataClassBean[] | DataClassBean[];
  status: number;
  headers: Headers;
};

export const getDataClassesUrl = (withFields: Boolean = false) => {
  return `/web-ide/dataclasses${withFields ? '/with-fields' : ''}`;
};

export const dataClasses = async (options?: RequestInit, withFields: Boolean = false): Promise<dataClassesResponse> => {
  return customFetch<dataClassesResponse>(getDataClassesUrl(withFields), {
    ...options,
    method: 'GET'
  });
};

export type createDataClassResponse = {
  data: DataClassBean | DataClassBean;
  status: number;
  headers: Headers;
};

export const getCreateDataClassUrl = () => {
  return `/web-ide/dataclass`;
};

export const createDataClass = async (dataClassInit: DataClassInit, options?: RequestInit): Promise<createDataClassResponse> => {
  return customFetch<createDataClassResponse>(getCreateDataClassUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(dataClassInit)
  });
};

export type deleteDataClassResponse = {
  data: DataClassIdentifier | DataClassIdentifier;
  status: number;
  headers: Headers;
};

export const getDeleteDataClassUrl = () => {
  return `/web-ide/dataclass`;
};

export const deleteDataClass = async (
  dataClassIdentifier: DataClassIdentifier,
  options?: RequestInit
): Promise<deleteDataClassResponse> => {
  return customFetch<deleteDataClassResponse>(getDeleteDataClassUrl(), {
    ...options,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(dataClassIdentifier)
  });
};

export type formsResponse = {
  data: HdBean[] | HdBean[];
  status: number;
  headers: Headers;
};

export const getFormsUrl = () => {
  return `/web-ide/forms`;
};

export const forms = async (options?: RequestInit): Promise<formsResponse> => {
  return customFetch<formsResponse>(getFormsUrl(), {
    ...options,
    method: 'GET'
  });
};

export type deleteFormResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getDeleteFormUrl = () => {
  return `/web-ide/form`;
};

export const deleteForm = async (formIdentifier: FormIdentifier, options?: RequestInit): Promise<deleteFormResponse> => {
  return customFetch<deleteFormResponse>(getDeleteFormUrl(), {
    ...options,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(formIdentifier)
  });
};

export type createHdResponse = {
  data: HdBean | HdBean;
  status: number;
  headers: Headers;
};

export const getCreateHdUrl = () => {
  return `/web-ide/hd`;
};

export const createHd = async (hdInit: HdInit, options?: RequestInit): Promise<createHdResponse> => {
  return customFetch<createHdResponse>(getCreateHdUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(hdInit)
  });
};

export type getProcessesResponse = {
  data: ProcessBean[] | ProcessBean[];
  status: number;
  headers: Headers;
};

export const getGetProcessesUrl = () => {
  return `/web-ide/processes`;
};

export const getProcesses = async (options?: RequestInit): Promise<getProcessesResponse> => {
  return customFetch<getProcessesResponse>(getGetProcessesUrl(), {
    ...options,
    method: 'GET'
  });
};

export type createProcessResponse = {
  data: ProcessBean | ProcessBean;
  status: number;
  headers: Headers;
};

export const getCreateProcessUrl = () => {
  return `/web-ide/process`;
};

export const createProcess = async (processInit: ProcessInit, options?: RequestInit): Promise<createProcessResponse> => {
  return customFetch<createProcessResponse>(getCreateProcessUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(processInit)
  });
};

export type deleteProcessResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getDeleteProcessUrl = () => {
  return `/web-ide/process`;
};

export const deleteProcess = async (processIdentifier: ProcessIdentifier, options?: RequestInit): Promise<deleteProcessResponse> => {
  return customFetch<deleteProcessResponse>(getDeleteProcessUrl(), {
    ...options,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(processIdentifier)
  });
};

export type buildProjectsResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getBuildProjectsUrl = () => {
  return `/web-ide/projects/build`;
};

export const buildProjects = async (buildProjectsBody: string[], options?: RequestInit): Promise<buildProjectsResponse> => {
  return customFetch<buildProjectsResponse>(getBuildProjectsUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': '*/*', ...options?.headers },
    body: JSON.stringify(buildProjectsBody)
  });
};

export type deployProjectsResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getDeployProjectsUrl = () => {
  return `/web-ide/projects/deploy`;
};

export const deployProjects = async (deployProjectsBody: string[], options?: RequestInit): Promise<deployProjectsResponse> => {
  return customFetch<deployProjectsResponse>(getDeployProjectsUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': '*/*', ...options?.headers },
    body: JSON.stringify(deployProjectsBody)
  });
};

export type projectsResponse = {
  data: ProjectBean[] | ProjectBean[];
  status: number;
  headers: Headers;
};

export const getProjectsUrl = (withDependencies: boolean = false) => {
  return `/web-ide/projects` + (withDependencies ? '/with-dependencies' : '');
};

export const projects = async (withDependencies: boolean = false, options?: RequestInit): Promise<projectsResponse> => {
  return customFetch<projectsResponse>(getProjectsUrl(withDependencies), {
    ...options,
    method: 'GET'
  });
};

export type createPmvAndProjectFilesResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getCreatePmvAndProjectFilesUrl = () => {
  return `/web-ide/project/new`;
};

export const createPmvAndProjectFiles = async (
  newProjectParams: NewProjectParams,
  options?: RequestInit
): Promise<createPmvAndProjectFilesResponse> => {
  return customFetch<createPmvAndProjectFilesResponse>(getCreatePmvAndProjectFilesUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(newProjectParams)
  });
};

export type findOrCreatePmvResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getFindOrCreatePmvUrl = () => {
  return `/web-ide/project`;
};

export const findOrCreatePmv = async (projectParams: ProjectParams, options?: RequestInit): Promise<findOrCreatePmvResponse> => {
  return customFetch<findOrCreatePmvResponse>(getFindOrCreatePmvUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(projectParams)
  });
};

export type deleteProjectResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getDeleteProjectUrl = (params?: DeleteProjectParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString());
    }
  });

  return normalizedParams.size ? `/web-ide/project?${normalizedParams.toString()}` : `/web-ide/project`;
};

export const deleteProject = async (params?: DeleteProjectParams, options?: RequestInit): Promise<deleteProjectResponse> => {
  return customFetch<deleteProjectResponse>(getDeleteProjectUrl(params), {
    ...options,
    method: 'DELETE'
  });
};

export type stopBpmEngineResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getStopBpmEngineUrl = (params?: StopBpmEngineParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString());
    }
  });

  return normalizedParams.size ? `/web-ide/project/stop-bpm-engine?${normalizedParams.toString()}` : `/web-ide/project/stop-bpm-engine`;
};

export const stopBpmEngine = async (params?: StopBpmEngineParams, options?: RequestInit): Promise<stopBpmEngineResponse> => {
  return customFetch<stopBpmEngineResponse>(getStopBpmEngineUrl(params), {
    ...options,
    method: 'POST'
  });
};

export type dependenciesResponse = {
  data: ProjectIdentifier[] | ProjectIdentifier[];
  status: number;
  headers: Headers;
};

export const getDependenciesUrl = (app: string, pmv: string) => {
  return `/web-ide/project/${app}/${pmv}/dependencies`;
};

export const dependencies = async (app: string, pmv: string, options?: RequestInit): Promise<dependenciesResponse> => {
  return customFetch<dependenciesResponse>(getDependenciesUrl(app, pmv), {
    ...options,
    method: 'GET'
  });
};

export type addDependencyResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getAddDependencyUrl = (app: string, pmv: string) => {
  return `/web-ide/project/${app}/${pmv}/dependency`;
};

export const addDependency = async (
  app: string,
  pmv: string,
  projectIdentifier: ProjectIdentifier,
  options?: RequestInit
): Promise<addDependencyResponse> => {
  return customFetch<addDependencyResponse>(getAddDependencyUrl(app, pmv), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(projectIdentifier)
  });
};

export type removeDependencyResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getRemoveDependencyUrl = (app: string, pmv: string, dependencyApp: string, dependencyPmv: string) => {
  return `/web-ide/project/${app}/${pmv}/dependency/${dependencyApp}/${dependencyPmv}`;
};

export const removeDependency = async (
  app: string,
  pmv: string,
  dependencyApp: string,
  dependencyPmv: string,
  options?: RequestInit
): Promise<removeDependencyResponse> => {
  return customFetch<removeDependencyResponse>(getRemoveDependencyUrl(app, pmv, dependencyApp, dependencyPmv), {
    ...options,
    method: 'DELETE'
  });
};

export type workspacesResponse = {
  data: WorkspaceBean[] | WorkspaceBean[];
  status: number;
  headers: Headers;
};

export const getWorkspacesUrl = () => {
  return `/web-ide/workspaces`;
};

export const workspaces = async (options?: RequestInit): Promise<workspacesResponse> => {
  return customFetch<workspacesResponse>(getWorkspacesUrl(), {
    ...options,
    method: 'GET'
  });
};

export type createWorkspaceResponse = {
  data: WorkspaceBean | WorkspaceBean;
  status: number;
  headers: Headers;
};

export const getCreateWorkspaceUrl = () => {
  return `/web-ide/workspace`;
};

export const createWorkspace = async (workspaceInit: WorkspaceInit, options?: RequestInit): Promise<createWorkspaceResponse> => {
  return customFetch<createWorkspaceResponse>(getCreateWorkspaceUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(workspaceInit)
  });
};

export type exportWorkspaceResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getExportWorkspaceUrl = (id: string) => {
  return `/web-ide/workspace/${id}`;
};

export const exportWorkspace = async (id: string, options?: RequestInit): Promise<exportWorkspaceResponse> => {
  return customFetch<exportWorkspaceResponse>(getExportWorkspaceUrl(id), {
    ...options,
    method: 'GET'
  });
};

export type importProjectsResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getImportProjectsUrl = (id: string) => {
  return `/web-ide/workspace/${id}`;
};

export const importProjects = async (
  id: string,
  importProjectsBody: ImportProjectsBody,
  options?: RequestInit
): Promise<importProjectsResponse> => {
  const formData = new FormData();
  if (importProjectsBody.file !== undefined) {
    formData.append('file', importProjectsBody.file);
  }
  if (importProjectsBody.dependentProject !== undefined) {
    formData.append('dependentProject', importProjectsBody.dependentProject);
  }

  return customFetch<importProjectsResponse>(getImportProjectsUrl(id), {
    ...options,
    method: 'POST',
    body: formData
  });
};

export type deleteWorkspaceResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getDeleteWorkspaceUrl = (id: string) => {
  return `/web-ide/workspace/${id}`;
};

export const deleteWorkspace = async (id: string, options?: RequestInit): Promise<deleteWorkspaceResponse> => {
  return customFetch<deleteWorkspaceResponse>(getDeleteWorkspaceUrl(id), {
    ...options,
    method: 'DELETE'
  });
};

export type installMarketProductResponse = {
  data: MarketInstallResult | MarketInstallResult;
  status: number;
  headers: Headers;
};

export const getInstallMarketProductUrl = (id: string) => {
  return `/web-ide/workspace/install/${id}`;
};

export const installMarketProduct = async (
  id: string,
  productInstallParams: ProductInstallParams,
  options?: RequestInit
): Promise<installMarketProductResponse> => {
  return customFetch<installMarketProductResponse>(getInstallMarketProductUrl(id), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(productInstallParams)
  });
};
