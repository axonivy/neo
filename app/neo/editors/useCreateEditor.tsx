import { IvyIcons } from '@axonivy/ui-icons';
import { useParams } from '@remix-run/react';
import { Form } from '~/data/form-api';
import { DataClassBean } from '~/data/generated/openapi-dev';
import { Process } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { lastSegment } from '~/utils/path';
import { Editor, EditorType } from './useEditors';

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
    createVariableEditor: (project: ProjectIdentifier): Editor => createEditor(ws, 'configurations', project, 'variables', 'variables'),
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
  return path.split('.p.json')[0].split('.f.json')[0].split('.d.json')[0];
};

const typeFromPath = (path: string): EditorType => {
  if (path.endsWith('.p.json')) {
    return 'processes';
  }
  if (path.endsWith('.f.json')) {
    return 'forms';
  }
  if (path.endsWith('.d.json')) {
    return 'dataclasses';
  }
  return 'configurations';
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
