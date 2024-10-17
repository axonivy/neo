import { toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useParams } from '@remix-run/react';
import type { Form } from '~/data/form-api';
import type { DataClassBean } from '~/data/generated/openapi-dev';
import type { Process } from '~/data/process-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { lastSegment } from '~/utils/path';
import { DATACLASS_EDITOR_SUFFIX, type Editor, type EditorType, FORM_EDITOR_SUFFIX, PROCESS_EDITOR_SUFFIX } from './editor';

export const useCreateEditor = () => {
  const ws = useParams().ws ?? 'designer';
  return {
    createFormEditor: ({ name, path, identifier: { project } }: Form): Editor => createEditor(ws, 'forms', project, `src_hd/${path}`, name),
    createProcessEditor: ({ name, path, processIdentifier: { project }, kind, namespace }: Process): Editor => {
      if (kind === 'HTML_DIALOG') {
        path = `src_hd/${namespace}/${name}`;
        return createEditor(ws, 'processes', project, path, name);
      }
      return createEditor(ws, 'processes', project, `processes/${path ?? name}`, name);
    },
    createVariableEditor: (project: ProjectIdentifier): Editor =>
      createEditor(ws, 'configurations', project, 'config/variables', 'variables'),
    createDataClassEditor: ({ simpleName, path, dataClassIdentifier: { project } }: DataClassBean): Editor =>
      createEditor(ws, 'dataclasses', project, path, simpleName),
    createEditorFromPath: (project: ProjectIdentifier, path: string, editorType?: EditorType): Editor =>
      createEditor(ws, editorType ?? typeFromPath(path), project, path, lastSegment(path) ?? path)
  };
};

const createEditor = (ws: string, editorType: EditorType, project: ProjectIdentifier, path: string, name: string): Editor => {
  const id = `/${ws}/${editorType}/${project.app}/${project.pmv}/${path}`;
  return {
    id: removeExtension(id),
    type: editorType,
    icon: editorIcon(editorType),
    name: removeExtension(name),
    project,
    path: removeExtension(path)
  };
};

const removeExtension = (path: string) => {
  return path.split(PROCESS_EDITOR_SUFFIX)[0].split(FORM_EDITOR_SUFFIX)[0].split(DATACLASS_EDITOR_SUFFIX)[0];
};

const typeFromPath = (path: string): EditorType => {
  if (path.endsWith(PROCESS_EDITOR_SUFFIX)) {
    return 'processes';
  }
  if (path.endsWith(FORM_EDITOR_SUFFIX)) {
    return 'forms';
  }
  if (path.endsWith(DATACLASS_EDITOR_SUFFIX)) {
    return 'dataclasses';
  }
  if (path.endsWith('.yaml')) {
    return 'configurations';
  }
  toast.error(`Unknown editor type`, { description: `This file type '${lastSegment(path)}' can not be edited in Neo.` });
  throw new Error(`Unknown editor type for path ${path}`);
};

const editorIcon = (editorType: EditorType) => {
  switch (editorType) {
    case 'forms':
      return IvyIcons.File;
    case 'configurations':
      return IvyIcons.Tool;
    case 'dataclasses':
      return IvyIcons.Database;
  }
  return IvyIcons.Process;
};
