import { Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import type { ProcessBean } from '~/data/generated/ivy-client';
import { useCreateProcess, useDeleteProcess, useProcesses } from '~/data/process-api';
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
import { ImportBpmnDialog } from './ImportBpmnDialog';

export const meta: MetaFunction = overviewMetaFunctionProvider('Processes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useProcesses();
  const { allBadges, badgesFor } = useBadges();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (proc, search, projects, badges) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(proc.processIdentifier.project.pmv);
    const hasMatchingBade =
      badges.length === 0 ||
      badges.some(badge =>
        badgesFor(proc)
          ?.map(b => b.label)
          .includes(badge)
      );
    const nameMatches = proc.name.toLocaleLowerCase().includes(search);
    console.log(`Filtering ${proc.name}: ${hasMatchingProject}, ${hasMatchingBade}, ${nameMatches}`);
    return hasMatchingProject && hasMatchingBade && nameMatches;
  });
  const { sortedArtifacts, setSortDirection } = useSortedArtifacts(filteredAritfacts, processBean => processBean.name);

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.processes') }]} />
      <OverviewTitle title={t('neo.processes')} description={t('processes.processDescription')}>
        <Flex gap={2}>
          <ImportBpmnDialog />
          <NewProcessButton />
        </Flex>
      </OverviewTitle>
      <OverviewFilter {...overviewFilter}>
        <OverviewSortBy setSortDirection={setSortDirection} />
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          badges={overviewFilter.badges}
          setBadges={overviewFilter.setBadges}
          allBadges={allBadges}
        />
      </OverviewFilter>
      <OverviewFilterBadges {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {sortedArtifacts.map(process => (
          <ProcessCard key={`${process.processIdentifier.project.pmv}/${process.processIdentifier.pid}`} process={process} />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const ProcessCard = ({ process }: { process: ProcessBean }) => {
  const { t } = useTranslation();
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const { createProcessEditor } = useCreateEditor();
  const editor = createProcessEditor(process);
  const { badgesFor } = useBadges();
  const badges = badgesFor(process);
  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='process' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      badges={badges}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => {
            removeEditor(editor.id);
            deleteProcess(process.processIdentifier);
          },
          isDeletable: editor.project.isIar === false,
          message: t('message.processPackaged'),
          artifact: t('artifact.type.process')
        }}
        {...dialogState}
      />
    </ArtifactCard>
  );
};

const useBadges = () => {
  const { t } = useTranslation();
  const allBadges = [t('common.label.readOnly'), t('label.callableSubProcess'), t('label.webServiceProcess')] as const;
  const badgesFor = (process: ProcessBean) => {
    const badges: Array<Badge> = [];
    if (process.processIdentifier.project.isIar) {
      badges.push({ label: allBadges[0], badgeStyle: 'secondary' });
    }
    if (process.kind === 'CALLABLE_SUB') {
      badges.push({ label: allBadges[1], badgeStyle: 'orange' });
    }
    if (process.kind === 'WEB_SERVICE') {
      badges.push({ label: allBadges[2], badgeStyle: 'green' });
    }
    return badges;
  };
  return { allBadges, badgesFor };
};

export const useProcessExists = () => {
  const { data } = useProcesses();
  return ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.filter(process => process.processIdentifier.project.pmv === project?.pmv)
      ?.some(process => process.name.toLowerCase() === name.toLowerCase() && process.namespace.toLowerCase() === namespace.toLowerCase()) ??
    false;
};

const NewProcessButton = () => {
  const { t } = useTranslation();
  const open = useNewArtifact();
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project }).then(process => openEditor(createProcessEditor(process)));
  const exists = useProcessExists();
  return (
    <CreateNewArtefactButton
      title={t('processes.newProcess')}
      onClick={() => open({ create, exists, type: 'Process', namespaceRequired: false })}
    />
  );
};
