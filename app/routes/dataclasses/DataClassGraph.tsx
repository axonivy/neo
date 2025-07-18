import { BasicSelect } from '@axonivy/ui-components';
import { Graph, type NodeData } from '@axonivy/ui-graph';
import { useTranslation } from 'react-i18next';
import { useDataClassesWithFields } from '~/data/data-class-api';
import type { DataClassBean, DataClassField } from '~/data/generated/ivy-client';
import { useSortedProjects } from '~/data/project-api';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { GraphControls } from '../workspace/ProjectGraph';

export const DataClassGraph = ({ selectedProject }: { selectedProject: string }) => {
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
  if (selectedProject === 'all') {
    return data.map(toNode);
  }

  //classes that are 'in' the project
  const inProject = data.filter(dc => dc.dataClassIdentifier.project.pmv === selectedProject);
  const inProjectIds = new Set(inProject.map(dc => dc.name));

  //classes that the project’s classes 'refer to'
  const referencedIds = new Set<string>();
  inProject.forEach(dc => dc.fields.forEach(f => referencedIds.add(f.type)));

  //classes that 'refer back' to the project’s classes
  const referringIds = new Set<string>();
  data.forEach(dc => {
    if (dc.fields.some(f => inProjectIds.has(f.type))) {
      referringIds.add(dc.name);
    }
  });

  const keepIds = new Set<string>([...inProjectIds, ...referencedIds, ...referringIds]);
  return data.filter(dc => keepIds.has(dc.name)).map(toNode);
};

const toNode = (dc: DataClassBean): NodeData => ({
  id: dc.name,
  label: dc.simpleName,
  info: dc.name,
  content: <FieldContent fields={dc.fields} />,
  options: {
    expandContent: true,
    controls: <DataClassGraphControls dc={dc} />
  },
  target: dc.fields.map(field => ({ id: field.type }))
});

type DataClassGraphFilterProps = {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
};

export const DataClassGraphFilter = ({ selectedProject, setSelectedProject }: DataClassGraphFilterProps) => {
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

const FieldContent = ({ fields }: { fields: DataClassField[] }) => (
  <ul style={{ padding: '0 10px', listStyle: 'none', margin: 0, overflow: 'auto' }}>
    {fields.map((field: { name: string; type: string }) => (
      <li key={field.name} style={{ display: 'flex', gap: '5px' }}>
        <div>{field.name}:</div>
        <div style={{ color: 'var(--N700)' }}>{field.type}</div>
      </li>
    ))}
  </ul>
);

const DataClassGraphControls = ({ dc }: { dc: DataClassBean }) => {
  const { createDataClassEditor } = useCreateEditor();
  const { openEditor } = useEditors();
  const editor = createDataClassEditor(dc);
  return <GraphControls openAction={() => openEditor(editor)} />;
};
