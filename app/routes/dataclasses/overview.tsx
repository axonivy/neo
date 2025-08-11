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
import type { TagStyle } from '~/neo/overview/artifact/ArtifactTag';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewFilterTags } from '~/neo/overview/OverviewFilterTags';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { DataClassGraph, DataClassGraphFilter } from './DataClassGraph';

export const meta: MetaFunction = overviewMetaFunctionProvider('Data Classes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useDataClasses();
  const { allTags, tagsFor } = useTags();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (dc, search, projects, tags) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(dc.dataClassIdentifier.project.pmv);
    const hasMatchingTag =
      tags.length === 0 ||
      tags.some(tag =>
        tagsFor(dc)
          ?.map(t => t.label)
          .includes(tag)
      );
    const nameMatches = dc.simpleName.toLocaleLowerCase().includes(search);
    return hasMatchingProject && hasMatchingTag && nameMatches;
  });
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
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          allTags={allTags}
          tags={overviewFilter.tags}
          setTags={overviewFilter.setTags}
        />
      </OverviewFilter>
      <OverviewFilterTags {...overviewFilter} />
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
  const { tagsFor } = useTags();
  const tags = tagsFor(dataClass);

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

const useTags = () => {
  const { t } = useTranslation();
  const allTags: Array<string> = [t('common.label.readOnly'), t('label.businessData'), t('label.entity')];
  const tagsFor = (dataClass: DataClassBean) => {
    const tags: Array<{ label: string; tagStyle: TagStyle }> = [];
    if (dataClass.dataClassIdentifier.project.isIar) {
      tags.push({ label: allTags[0], tagStyle: 'secondary' });
    }
    if (dataClass.isBusinessCaseData) {
      tags.push({ label: allTags[1], tagStyle: 'primary' });
    }
    if (dataClass.isEntityClass) {
      tags.push({ label: allTags[2], tagStyle: 'destructive' });
    }
    return tags;
  };
  return { allTags, tagsFor };
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
