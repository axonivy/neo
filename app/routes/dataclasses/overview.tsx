import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';
import { useCreateDataClass, useDataClasses, useDeleteDataClass } from '~/data/data-class-api';
import type { DataClassBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
import type { Badge } from '~/neo/overview/artifact/ArtifactBadge';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewFilterBadges } from '~/neo/overview/OverviewFilterBadges';
import { OverviewSortBy, useSortedArtifacts } from '~/neo/overview/OverviewSortBy';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { DataClassGraph, DataClassGraphFilter } from './DataClassGraph';

export const meta: MetaFunction = overviewMetaFunctionProvider('Data Classes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useDataClasses();
  const { allBadges, badgesFor } = useBadges();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (dc, search, projects, badges) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(dc.dataClassIdentifier.project.pmv);
    const hasMatchingBade =
      badges.length === 0 ||
      badges.some(badge =>
        badgesFor(dc)
          ?.map(b => b.label)
          .includes(badge)
      );
    const nameMatches = dc.simpleName.toLocaleLowerCase().includes(search);
    return hasMatchingProject && hasMatchingBade && nameMatches;
  });
  const { ws } = useParams();
  const [selectedProject, setSelectedProject] = useState<string>(ws ?? 'all');
  const { sortedArtifacts, setSortDirection } = useSortedArtifacts(filteredAritfacts, dataClassBean => dataClassBean.simpleName);

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
        <OverviewSortBy setSortDirection={setSortDirection} />
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          allBadges={allBadges}
          badges={overviewFilter.badges}
          setBadges={overviewFilter.setBadges}
        />
      </OverviewFilter>
      <OverviewFilterBadges {...overviewFilter} />
      <OverviewContent
        isPending={isPending}
        viewType={overviewFilter.viewType}
        viewTypes={{ graph: <DataClassGraph selectedProject={selectedProject} /> }}
      >
        {sortedArtifacts.map(dataclass => (
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
  const { badgesFor } = useBadges();
  const badges = badgesFor(dataClass);

  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='dataClass' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      badges={badges}
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

const useBadges = () => {
  const { t } = useTranslation();
  const allBadges: Array<string> = [t('common.label.readOnly'), t('label.businessData'), t('label.entity')];
  const badgesFor = (dataClass: DataClassBean) => {
    const badges: Array<Badge> = [];
    if (dataClass.dataClassIdentifier.project.isIar) {
      badges.push({ label: allBadges[0], badgeStyle: 'secondary' });
    }
    if (dataClass.isBusinessCaseData) {
      badges.push({ label: allBadges[1], badgeStyle: 'primary' });
    }
    if (dataClass.isEntityClass) {
      badges.push({ label: allBadges[2], badgeStyle: 'destructive' });
    }
    return badges;
  };
  return { allBadges, badgesFor };
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
