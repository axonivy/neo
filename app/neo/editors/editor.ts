import { IvyIcons } from '@axonivy/ui-icons';
import type { ProjectIdentifier } from '~/data/project-api';

export type EditorType = 'processes' | 'forms' | 'configurations' | 'dataclasses' | 'variables' | 'roles' | 'users' | 'cms' | 'databases';

// if you change the Editor type increase the zustand version too
export type Editor = { id: string; type: EditorType; icon: IvyIcons; name: string; project: ProjectIdentifier; path: string };

export const FORM_EDITOR_SUFFIX = '.f.json';
export const PROCESS_EDITOR_SUFFIX = '.p.json';
export const DATACLASS_EDITOR_SUFFIX = '.d.json';
export const CONFIG_EDITOR_YAML_SUFFIX = '.yaml';
export const CONFIG_EDITOR_XML_SUFFIX = '.xml';
export const VARIABLES_EDITOR_SUFFIX = 'variables.yaml';
export const ROLES_EDITOR_SUFFIX = 'roles.yaml';
export const USERS_EDITOR_SUFFIX = 'users.yaml';
export const CMS_EDITOR_SUFFIX = 'cms';
export const DATABASES_EDITOR_SUFFIX = 'databases.yaml';

export const DIALOG_PROCESS_EDITOR_SUFFIX = `Process${PROCESS_EDITOR_SUFFIX}`;
export const DIALOG_DATA_EDITOR_SUFFIX = `Data${DATACLASS_EDITOR_SUFFIX}`;
