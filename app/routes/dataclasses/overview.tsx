import { BasicSelect, Button, Graph } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useCreateDataClass, useDataClassesWithFields, useDeleteDataClass, useGroupedDataClasses } from '~/data/data-class-api';
import type { DataClassBean, DataClassField } from '~/data/generated/ivy-client';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './dataclass-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Data Classes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useGroupedDataClasses();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (d: DataClassBean) => d.name);
  const { createDataClassEditor } = useCreateEditor();
  return (
    <Overview
      title={t('neo.dataClasses')}
      description={t('dataclasses.dataclassDescription')}
      search={search}
      graph={<DataClassGraph />}
      onSearchChange={setSearch}
      isPending={isPending}
    >
      {filteredGroups.map(({ project, artifacts }) => (
        <ArtifactGroup project={project} newArtifactCard={<NewDataClassCard />} key={project}>
          {artifacts.map(dc => {
            const editor = createDataClassEditor(dc);

            return <DataClassCard key={editor.id} dataClass={dc} {...editor} />;
          })}
        </ArtifactGroup>
      ))}
    </Overview>
  );
}

const DataClassCard = ({ dataClass, ...editor }: Editor & { dataClass: DataClassBean }) => {
  const { t } = useTranslation();
  const { deleteDataClass } = useDeleteDataClass();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = {
    run: () => {
      removeEditor(editor.id);
      deleteDataClass(dataClass.dataClassIdentifier);
    },
    isDeletable: editor.project.isIar === false,
    message: t('message.dataclassPackaged')
  };
  const tagLabel = dataClass.isEntityClass ? t('label.entity') : dataClass.isBusinessCaseData ? t('label.businessData') : '';
  return (
    <ArtifactCard
      name={editor.name}
      type='dataclass'
      preview={<PreviewSVG />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
      tagLabel={tagLabel}
    />
  );
};

const NewDataClassCard = () => {
  const { t } = useTranslation();
  const open = useNewArtifact();
  const { createDataClass } = useCreateDataClass();
  const { openEditor } = useEditors();
  const { createDataClassEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createDataClass({ name: `${namespace}.${name}`, project }).then(dataClass => openEditor(createDataClassEditor(dataClass)));
  const { data } = useGroupedDataClasses();
  const exists = ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.find(group => group?.project === project?.pmv)
      ?.artifacts.some(dc => dc.name.toLowerCase() === `${namespace.toLowerCase()}.${name.toLowerCase()}`) ?? false;
  const title = t('dataclasses.newDataclass');
  return <NewArtifactCard title={title} open={() => open({ create, exists, type: 'Data Class', namespaceRequired: true })} />;
};

const DataClassGraph = () => {
  const { data } = useDataClassesWithFields();
  const { createDataClassEditor } = useCreateEditor();
  const { openEditor } = useEditors();
  const { data: projects } = useSortedProjects();
  const [selectedProject, setSelectedProject] = useState<string>('all');

  return (
    <>
      <BasicSelect
        value={selectedProject}
        onValueChange={setSelectedProject}
        items={[
          { value: 'all', label: 'Show all' },
          ...(projects ?? []).map(project => ({
            value: project.id.pmv,
            label: project.id.pmv
          }))
        ]}
        menuWidth='200px'
      />
      <Graph
        graphNodes={(data ?? [])
          .filter(dc => selectedProject === 'all' || dc.dataClassIdentifier.project.pmv === selectedProject)
          .map(dc => ({
            id: dc.name,
            label: dc.simpleName,
            info: dc.name,
            content: <FieldContent fields={dc.fields} />,
            options: {
              expandContent: true,
              controls: (
                <Button
                  icon={IvyIcons.DataClass}
                  onClick={() => {
                    const editor = createDataClassEditor(dc);
                    openEditor(editor);
                  }}
                />
              )
            },
            target: dc.fields.map(field => ({ id: field.type }))
          }))}
        options={{ filter: true, circleFloatingEdges: true, minimap: true }}
      />
    </>
  );
};

const FieldContent = ({ fields }: { fields: DataClassField[] }) => {
  return (
    <ul style={{ padding: '0 10px', listStyle: 'none', margin: 0, overflow: 'auto' }}>
      {fields.map((field: { name: string; type: string }) => (
        <li key={field.name} style={{ display: 'flex', gap: '5px' }}>
          <div>{field.name}:</div>
          <div style={{ color: 'var(--N700) ' }}>{field.type}</div>
        </li>
      ))}
    </ul>
  );
};
