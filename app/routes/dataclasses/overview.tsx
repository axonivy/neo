import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';
import { useCreateDataClass, useDataClasses, useDeleteDataClass } from '~/data/data-class-api';
import type { DataClassBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { DataClassGraph, DataClassGraphFilter } from './DataClassGraph';

export const meta: MetaFunction = overviewMetaFunctionProvider('Data Classes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useDataClasses();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(
    data ?? [],
    (dc, search, projects) =>
      (projects.length === 0 || projects.includes(dc.dataClassIdentifier.project.pmv)) && dc.simpleName.toLocaleLowerCase().includes(search)
  );
  const { ws } = useParams();
  const [selectedProject, setSelectedProject] = useState<string>(ws ?? 'all');
  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.dataClasses') }]} />
      <OverviewTitle title={t('neo.dataClasses')} description={t('dataclasses.dataclassDescription')}>
        <NewDataClassButton />
      </OverviewTitle>
      <OverviewFilter
        {...overviewFilter}
        viewTypes={{ graph: <DataClassGraphFilter selectedProject={selectedProject} setSelectedProject={setSelectedProject} /> }}
      >
        <OverviewProjectFilter projects={overviewFilter.projects} setProjects={overviewFilter.setProjects} />
      </OverviewFilter>
      <OverviewContent
        isPending={isPending}
        viewType={overviewFilter.viewType}
        viewTypes={{ graph: <DataClassGraph selectedProject={selectedProject} /> }}
      >
        {filteredAritfacts.map(dataclass => (
          <DataClassCard
            key={`${dataclass.dataClassIdentifier.project.pmv}/${dataclass.path}/${dataclass.simpleName}`}
            dataClass={dataclass}
          />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const DataClassCard = ({ dataClass }: { dataClass: DataClassBean }) => {
  const { t } = useTranslation();
  const { deleteDataClass } = useDeleteDataClass();
  const { openEditor, removeEditor } = useEditors();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const { createDataClassEditor } = useCreateEditor();
  const editor = createDataClassEditor(dataClass);
  const tags = useDataClassTags(dataClass);
  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='dataClass' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      tags={tags}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => {
            removeEditor(editor.id);
            deleteDataClass(dataClass.dataClassIdentifier);
          },
          isDeletable: editor.project.isIar === false,
          message: t('message.dataclassPackaged'),
          artifact: t('artifact.type.dataclass')
        }}
        {...dialogState}
      />
    </ArtifactCard>
  );
};

const useDataClassTags = (dataClass: DataClassBean) => {
  const { t } = useTranslation();
  const tags = [];
  if (dataClass.dataClassIdentifier.project.isIar) {
    tags.push(t('common.label.readOnly'));
  }
  if (dataClass.isEntityClass) {
    tags.push(t('label.entity'));
  }
  if (dataClass.isBusinessCaseData) {
    tags.push(t('label.businessData'));
  }
  return tags;
};

const useDataClassExists = () => {
  const { data } = useDataClasses();
  return ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.filter(dc => dc.dataClassIdentifier.project.pmv === project?.pmv)
      ?.some(dc => dc.name.toLowerCase() === `${namespace.toLowerCase()}.${name.toLowerCase()}`) ?? false;
};

const NewDataClassButton = () => {
  const { t } = useTranslation();
  const open = useNewArtifact();
  const { createDataClass } = useCreateDataClass();
  const { openEditor } = useEditors();
  const { createDataClassEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createDataClass({ name: `${namespace}.${name}`, project }).then(dataClass => openEditor(createDataClassEditor(dataClass)));
  const exists = useDataClassExists();
  return (
    <CreateNewArtefactButton
      title={t('dataclasses.newDataclass')}
      onClick={() => open({ create, exists, type: 'Data Class', namespaceRequired: true })}
    />
  );
};
