/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Axon Ivy
 */
import { customFetch } from '../custom-fetch';
export type DeployProjectsParams = {
  projectDir?: string[];
};

export type DeleteProjectParams = {
  projectDir?: string;
};

export type BuildParams = {
  projectDir?: string[];
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

export interface InitProjectParams {
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
  pmv: string;
}

export interface HdInit {
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

export type projectsResponse = {
  data: ProjectIdentifier[];
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

export type watchProjectsResponse = {
  data: unknown;
  status: number;
};

export const getWatchProjectsUrl = () => {
  return `/web-ide/projects/watch`;
};

export const watchProjects = async (options?: RequestInit): Promise<watchProjectsResponse> => {
  return customFetch<Promise<watchProjectsResponse>>(getWatchProjectsUrl(), {
    ...options,
    method: 'GET'
  });
};

export type buildResponse = {
  data: unknown;
  status: number;
};

export const getBuildUrl = (params?: BuildParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });

  return normalizedParams.size ? `/web-ide/project/build?${normalizedParams.toString()}` : `/web-ide/project/build`;
};

export const build = async (params?: BuildParams, options?: RequestInit): Promise<buildResponse> => {
  return customFetch<Promise<buildResponse>>(getBuildUrl(params), {
    ...options,
    method: 'GET'
  });
};

export type createProjectResponse = {
  data: unknown;
  status: number;
};

export const getCreateProjectUrl = () => {
  return `/web-ide/project`;
};

export const createProject = async (newProjectParams: NewProjectParams, options?: RequestInit): Promise<createProjectResponse> => {
  return customFetch<Promise<createProjectResponse>>(getCreateProjectUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(newProjectParams)
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

export type deployProjectsResponse = {
  data: unknown;
  status: number;
};

export const getDeployProjectsUrl = (params?: DeployProjectsParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });

  return normalizedParams.size ? `/web-ide/project/deploy?${normalizedParams.toString()}` : `/web-ide/project/deploy`;
};

export const deployProjects = async (params?: DeployProjectsParams, options?: RequestInit): Promise<deployProjectsResponse> => {
  return customFetch<Promise<deployProjectsResponse>>(getDeployProjectsUrl(params), {
    ...options,
    method: 'GET'
  });
};

export type initExistingProjectResponse = {
  data: unknown;
  status: number;
};

export const getInitExistingProjectUrl = () => {
  return `/web-ide/project/init`;
};

export const initExistingProject = async (
  initProjectParams: InitProjectParams,
  options?: RequestInit
): Promise<initExistingProjectResponse> => {
  return customFetch<Promise<initExistingProjectResponse>>(getInitExistingProjectUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(initProjectParams)
  });
};
