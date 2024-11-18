/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Axon Ivy
 */
import { customFetch } from '../custom-fetch';
export type DeleteProjectParams = {
  projectDir?: string;
  app?: string;
  pmv?: string;
};

/**
 * The geographic coordinate of the location
 */
export interface GeoPositionBean {
  /** Altitude in meters */
  altitude?: number;
  /** Latitute in degree (south) -90.0d..+90.0d (north) */
  latitude?: number;
  /** Longitude in degree (west) -180.0d..+180.0d (east) */
  longitude?: number;
}

export interface LocationBean {
  /** The address of the location, e.g., Baarerstrasse 12;6403 Zug;Switzerland */
  address?: string;
  /** The name of the location, e.g., Zug, Wien */
  name?: string;
  /** Additional note */
  note?: string;
  position?: GeoPositionBean;
  /** The timestamp when the location was created or updated */
  timestamp?: string;
  /** The type of the location, e.g., UserPosition, HeadQuarter, BranchOffice */
  type?: string;
}

export interface TaskBean {
  activatorName?: string;
  case?: CaseBean;
  description?: string;
  expiryTimeStamp?: string;
  fullRequestPath?: string;
  id?: number;
  name?: string;
  offline?: boolean;
  priority?: number;
  startTimeStamp?: string;
  state?: number;
}

export interface StartCustomFieldBean {
  name?: string;
  value?: string;
}

export interface WebStartableBean {
  activatorName?: string;
  customFields?: StartCustomFieldBean[];
  description?: string;
  fullRequestPath?: string;
  id?: string;
  name?: string;
}

export interface ProcessStartBean {
  activatorName?: string;
  description?: string;
  fullRequestPath?: string;
  id?: number;
  name?: string;
}

export interface DocumentBean {
  id?: number;
  name?: string;
  path?: string;
  url?: string;
}

export interface CaseBean {
  description?: string;
  documents?: DocumentBean[];
  id?: number;
  name?: string;
}

export interface MessageBean {
  document?: DocumentBean;
  message?: string;
  statusCode?: number;
}

export interface AggBean {
  [key: string]: unknown;
}

export interface ProjectParams {
  name?: string;
  path?: string;
}

export interface NewProjectParams {
  defaultNamespace?: string;
  groupId?: string;
  name?: string;
  path?: string;
  projectId?: string;
}

export interface ProcessInit {
  kind: string;
  name: string;
  namespace: string;
  path?: string;
  pid?: string;
  project?: ProjectIdentifier;
}

export interface ProcessIdentifier {
  pid: string;
  project: ProjectIdentifier;
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
  kind: ProcessBeanKind;
  name: string;
  namespace: string;
  path?: string;
  processGroup?: string;
  processIdentifier: ProcessIdentifier;
  requestPath?: string;
  type?: string;
  uri?: string;
}

export interface ProjectIdentifier {
  app: string;
  isIar?: boolean;
  pmv: string;
}

export interface ProjectBean {
  artifactId: string;
  groupId: string;
  id: ProjectIdentifier;
  isDeletable: boolean;
  version: string;
}

export interface HdInit {
  dataClass?: DataClassIdentifier;
  layout?: string;
  name: string;
  namespace: string;
  pid?: string;
  project?: ProjectIdentifier;
  projectDir?: string;
  template?: string;
  type?: string;
}

export interface FormIdentifier {
  id: string;
  project: ProjectIdentifier;
}

export interface HdBean {
  identifier: FormIdentifier;
  name: string;
  namespace?: string;
  path: string;
  type?: string;
  uri?: string;
}

export interface DataClassInit {
  name: string;
  project?: ProjectIdentifier;
  projectDir?: string;
}

export interface DataClassIdentifier {
  name: string;
  project: ProjectIdentifier;
}

export interface DataClassBean {
  dataClassIdentifier: DataClassIdentifier;
  isBusinessCaseData: boolean;
  isEntityClass: boolean;
  name: string;
  path: string;
  simpleName: string;
}

export interface EngineInfo {
  engineName?: string;
  minimumSupportedMobileAppVersion?: string;
  version?: string;
}

export interface UserBean {
  emailAddress?: string;
  fullName?: string;
  language?: string;
  name?: string;
  uuid?: string;
}

export interface WebNotificationActionBean {
  link?: string;
  title?: string;
}

export interface WebNotificationBean {
  createdAt?: string;
  details?: WebNotificationActionBean;
  message?: string;
  read?: boolean;
  start?: WebNotificationActionBean;
  uuid?: string;
}

export type WebNotificationOperationOperation = (typeof WebNotificationOperationOperation)[keyof typeof WebNotificationOperationOperation];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WebNotificationOperationOperation = {
  MARK_AS_READ: 'MARK_AS_READ'
} as const;

export interface WebNotificationOperation {
  operation?: WebNotificationOperationOperation;
}

export type dataClassesResponse = {
  data: DataClassBean[];
  status: number;
};

export const getDataClassesUrl = () => {
  return `/web-ide/dataclasses`;
};

export const dataClasses = async (options?: RequestInit): Promise<dataClassesResponse> => {
  return customFetch<Promise<dataClassesResponse>>(getDataClassesUrl(), {
    ...options,
    method: 'GET'
  });
};

export type createDataClassResponse = {
  data: DataClassBean;
  status: number;
};

export const getCreateDataClassUrl = () => {
  return `/web-ide/dataclass`;
};

export const createDataClass = async (dataClassInit: DataClassInit, options?: RequestInit): Promise<createDataClassResponse> => {
  return customFetch<Promise<createDataClassResponse>>(getCreateDataClassUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(dataClassInit)
  });
};

export type deleteDataClassResponse = {
  data: DataClassIdentifier;
  status: number;
};

export const getDeleteDataClassUrl = () => {
  return `/web-ide/dataclass`;
};

export const deleteDataClass = async (
  dataClassIdentifier: DataClassIdentifier,
  options?: RequestInit
): Promise<deleteDataClassResponse> => {
  return customFetch<Promise<deleteDataClassResponse>>(getDeleteDataClassUrl(), {
    ...options,
    method: 'DELETE',
    body: JSON.stringify(dataClassIdentifier)
  });
};

export type formsResponse = {
  data: HdBean[];
  status: number;
};

export const getFormsUrl = () => {
  return `/web-ide/forms`;
};

export const forms = async (options?: RequestInit): Promise<formsResponse> => {
  return customFetch<Promise<formsResponse>>(getFormsUrl(), {
    ...options,
    method: 'GET'
  });
};

export type deleteFormResponse = {
  data: unknown;
  status: number;
};

export const getDeleteFormUrl = () => {
  return `/web-ide/form`;
};

export const deleteForm = async (formIdentifier: FormIdentifier, options?: RequestInit): Promise<deleteFormResponse> => {
  return customFetch<Promise<deleteFormResponse>>(getDeleteFormUrl(), {
    ...options,
    method: 'DELETE',
    body: JSON.stringify(formIdentifier)
  });
};

export type createHdResponse = {
  data: HdBean;
  status: number;
};

export const getCreateHdUrl = () => {
  return `/web-ide/hd`;
};

export const createHd = async (hdInit: HdInit, options?: RequestInit): Promise<createHdResponse> => {
  return customFetch<Promise<createHdResponse>>(getCreateHdUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(hdInit)
  });
};

export type getProcessesResponse = {
  data: ProcessBean[];
  status: number;
};

export const getGetProcessesUrl = () => {
  return `/web-ide/processes`;
};

export const getProcesses = async (options?: RequestInit): Promise<getProcessesResponse> => {
  return customFetch<Promise<getProcessesResponse>>(getGetProcessesUrl(), {
    ...options,
    method: 'GET'
  });
};

export type createProcessResponse = {
  data: ProcessBean;
  status: number;
};

export const getCreateProcessUrl = () => {
  return `/web-ide/process`;
};

export const createProcess = async (processInit: ProcessInit, options?: RequestInit): Promise<createProcessResponse> => {
  return customFetch<Promise<createProcessResponse>>(getCreateProcessUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(processInit)
  });
};

export type deleteProcessResponse = {
  data: unknown;
  status: number;
};

export const getDeleteProcessUrl = () => {
  return `/web-ide/process`;
};

export const deleteProcess = async (processIdentifier: ProcessIdentifier, options?: RequestInit): Promise<deleteProcessResponse> => {
  return customFetch<Promise<deleteProcessResponse>>(getDeleteProcessUrl(), {
    ...options,
    method: 'DELETE',
    body: JSON.stringify(processIdentifier)
  });
};

export type buildProjectsResponse = {
  data: unknown;
  status: number;
};

export const getBuildProjectsUrl = () => {
  return `/web-ide/projects/build`;
};

export const buildProjects = async (buildProjectsBody: string[], options?: RequestInit): Promise<buildProjectsResponse> => {
  return customFetch<Promise<buildProjectsResponse>>(getBuildProjectsUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(buildProjectsBody)
  });
};

export type deployProjectsResponse = {
  data: unknown;
  status: number;
};

export const getDeployProjectsUrl = () => {
  return `/web-ide/projects/deploy`;
};

export const deployProjects = async (deployProjectsBody: string[], options?: RequestInit): Promise<deployProjectsResponse> => {
  return customFetch<Promise<deployProjectsResponse>>(getDeployProjectsUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(deployProjectsBody)
  });
};

export type projectsResponse = {
  data: ProjectBean[];
  status: number;
};

export const getProjectsUrl = () => {
  return `/web-ide/projects`;
};

export const projects = async (options?: RequestInit): Promise<projectsResponse> => {
  return customFetch<Promise<projectsResponse>>(getProjectsUrl(), {
    ...options,
    method: 'GET'
  });
};

export type createPmvAndProjectFilesResponse = {
  data: unknown;
  status: number;
};

export const getCreatePmvAndProjectFilesUrl = () => {
  return `/web-ide/project/new`;
};

export const createPmvAndProjectFiles = async (
  newProjectParams: NewProjectParams,
  options?: RequestInit
): Promise<createPmvAndProjectFilesResponse> => {
  return customFetch<Promise<createPmvAndProjectFilesResponse>>(getCreatePmvAndProjectFilesUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(newProjectParams)
  });
};

export type findOrCreatePmvResponse = {
  data: unknown;
  status: number;
};

export const getFindOrCreatePmvUrl = () => {
  return `/web-ide/project`;
};

export const findOrCreatePmv = async (projectParams: ProjectParams, options?: RequestInit): Promise<findOrCreatePmvResponse> => {
  return customFetch<Promise<findOrCreatePmvResponse>>(getFindOrCreatePmvUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(projectParams)
  });
};

export type deleteProjectResponse = {
  data: unknown;
  status: number;
};

export const getDeleteProjectUrl = (params?: DeleteProjectParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });

  return normalizedParams.size ? `/web-ide/project?${normalizedParams.toString()}` : `/web-ide/project`;
};

export const deleteProject = async (params?: DeleteProjectParams, options?: RequestInit): Promise<deleteProjectResponse> => {
  return customFetch<Promise<deleteProjectResponse>>(getDeleteProjectUrl(params), {
    ...options,
    method: 'DELETE'
  });
};

export type dependenciesResponse = {
  data: ProjectIdentifier[];
  status: number;
};

export const getDependenciesUrl = (app: string, pmv: string) => {
  return `/web-ide/project/${app}/${pmv}/dependencies`;
};

export const dependencies = async (app: string, pmv: string, options?: RequestInit): Promise<dependenciesResponse> => {
  return customFetch<Promise<dependenciesResponse>>(getDependenciesUrl(app, pmv), {
    ...options,
    method: 'GET'
  });
};

export type addDependencyResponse = {
  data: unknown;
  status: number;
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
  return customFetch<Promise<addDependencyResponse>>(getAddDependencyUrl(app, pmv), {
    ...options,
    method: 'POST',
    body: JSON.stringify(projectIdentifier)
  });
};

export type removeDependencyResponse = {
  data: unknown;
  status: number;
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
  return customFetch<Promise<removeDependencyResponse>>(getRemoveDependencyUrl(app, pmv, dependencyApp, dependencyPmv), {
    ...options,
    method: 'DELETE'
  });
};
