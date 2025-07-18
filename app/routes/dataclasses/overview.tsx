import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useCreateDataClass, useDeleteDataClass, useGroupedDataClasses } from '~/data/data-class-api';
import type { DataClassBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { ArtifactCard, cardStylesLink } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { PreviewSvg } from '~/neo/artifact/PreviewSvg';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { DataClassGraph, DataClassGraphFilter } from './DataClassGraph';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Data Classes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useGroupedDataClasses();
  const { filteredGroups, overviewFilter } = useFilteredGroups(data ?? [], (d: DataClassBean) => d.name);
  const { createDataClassEditor } = useCreateEditor();
  const [selectedProject, setSelectedProject] = useState<string>(filteredGroups ? filteredGroups[0]?.project : 'all');

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.dataClasses') }]} />
      <OverviewTitle title={t('neo.dataClasses')} description={t('dataclasses.dataclassDescription')}>
        <NewDataClassButton />
      </OverviewTitle>
      <OverviewFilter
        {...overviewFilter}
        viewTypes={{ graph: <DataClassGraphFilter selectedProject={selectedProject} setSelectedProject={setSelectedProject} /> }}
      />
      <OverviewContent
        isPending={isPending}
        viewType={overviewFilter.viewType}
        viewTypes={{ graph: <DataClassGraph selectedProject={selectedProject} /> }}
      >
        {filteredGroups.map(({ project, artifacts }) => (
          <ArtifactGroup project={project} key={project}>
            {artifacts.map(dc => {
              const editor = createDataClassEditor(dc);
              return <DataClassCard key={editor.id} dataClass={dc} {...editor} />;
            })}
          </ArtifactGroup>
        ))}
      </OverviewContent>
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
      preview={<PreviewSvg type='dataClass' />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
      tagLabel={tagLabel}
    />
  );
};

const NewDataClassButton = () => {
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
  return (
    <CreateNewArtefactButton
      title={t('dataclasses.newDataclass')}
      open={() => open({ create, exists, type: 'Data Class', namespaceRequired: true })}
    />
  );
};
