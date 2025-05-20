import { BasicSelect } from '@axonivy/ui-components';
import { Graph, type NodeData } from '@axonivy/ui-graph';
import { useTranslation } from 'react-i18next';
import { useDataClassesWithFields } from '~/data/data-class-api';
import type { DataClassBean, DataClassField } from '~/data/generated/ivy-client';
import { useSortedProjects } from '~/data/project-api';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { GraphControls } from '../workspaces/ProjectGraph';

export const DataClasGraph = ({ selectedProject }: { selectedProject: string }) => {
  const { data } = useDataClassesWithFields();
  const { t } = useTranslation();
  return (
    <Graph
      graphNodes={mapDataClassesToGraphNodes(data, selectedProject)}
      options={{
        filter: { enabled: true, allLabel: t('common.label.showAll') },
        circleFloatingEdges: true,
        minimap: true,
        zoomOnInit: { level: 1, applyOnLayoutAndFilter: true }
      }}
    />
  );
};

export const mapDataClassesToGraphNodes = (data: DataClassBean[] | undefined, selectedProject: string): NodeData[] => {
  if (!data) {
    return [];
  }

  return data
    .filter(dc => selectedProject === 'all' || dc.dataClassIdentifier.project.pmv === selectedProject)
    .map(dc => ({
      id: dc.name,
      label: dc.simpleName,
      info: dc.name,
      content: <FieldContent fields={dc.fields} />,
      options: {
        expandContent: true,
        controls: <ProjectGraphControls dc={dc} />
      },
      target: dc.fields.map(field => ({ id: field.type }))
    }));
};

export const ProjectGraphFilter = ({
  selectedProject,
  setSelectedProject
}: {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
}) => {
  const { data: projects } = useSortedProjects();

  return (
    <BasicSelect
      value={selectedProject}
      onValueChange={setSelectedProject}
      items={[
        { value: 'all', label: 'Show all Projects' },
        ...(projects ?? []).map(project => ({
          value: project.id.pmv,
          label: project.id.pmv
        }))
      ]}
    />
  );
};

const FieldContent = ({ fields }: { fields: DataClassField[] }) => {
  return (
    <ul style={{ padding: '0 10px', listStyle: 'none', margin: 0, overflow: 'auto' }}>
      {fields.map((field: { name: string; type: string }) => (
        <li key={field.name} style={{ display: 'flex', gap: '5px' }}>
          <div>{field.name}:</div>
          <div style={{ color: 'var(--N700)' }}>{field.type}</div>
        </li>
      ))}
    </ul>
  );
};

const ProjectGraphControls = ({ dc }: { dc: DataClassBean }) => {
  const { createDataClassEditor } = useCreateEditor();
  const { openEditor } = useEditors();
  const editor = createDataClassEditor(dc);
  return <GraphControls openAction={() => openEditor(editor)} />;
};
