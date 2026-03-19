import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useCaseMaps, useDeleteCaseMap } from '~/data/casemap-api';
import type { CaseMapBean, ProcessBean } from '~/data/generated/ivy-client';
import { useDeleteProcess, useProcesses } from '~/data/process-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
import type { Badge } from '~/neo/overview/artifact/ArtifactBadge';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewFilterBadges } from '~/neo/overview/OverviewFilterBadges';
import { OverviewSortBy, useSortedArtifacts } from '~/neo/overview/OverviewSortBy';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { ProcessCreationActions } from './ProcessCreationActions';

export const meta: MetaFunction = overviewMetaFunctionProvider('Processes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useProcesses();
  const { data: caseMaps, isPending: isCaseMapsPending } = useCaseMaps();
  const { allBadges, badgesFor } = useBadges();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(
    [...(data ?? []), ...(caseMaps ?? [])],
    (proc, search, projects, badges) => {
      let hasMatchingProject = projects.length === 0;

      if (isProcessBean(proc)) {
        hasMatchingProject = hasMatchingProject || projects.includes(proc.processIdentifier.project.pmv);
      }
      if (isCaseMapBean(proc)) {
        hasMatchingProject = hasMatchingProject || projects.includes(proc.caseMapIdentifier.project.pmv);
      }
      const hasMatchingBade =
        badges.length === 0 ||
        badges.some(badge =>
          badgesFor(proc)
            ?.map(b => b.label)
            .includes(badge)
        );
      const nameMatches = proc.name.toLocaleLowerCase().includes(search);
      return hasMatchingProject && hasMatchingBade && nameMatches;
    }
  );
  const { sortedArtifacts, setSortDirection } = useSortedArtifacts(filteredAritfacts, artefact => artefact.name);

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.processes') }]} />
      <OverviewTitle title={t('neo.processes')} description={t('processes.processDescription')}>
        <ProcessCreationActions />
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
      <OverviewContent isPending={isPending || isCaseMapsPending}>
        {sortedArtifacts.map(artefact =>
          isProcessBean(artefact) ? (
            <ProcessCard key={`${artefact.processIdentifier.project.pmv}/${artefact.processIdentifier.pid}`} process={artefact} />
          ) : (
            <CaseMapCard key={`${artefact.caseMapIdentifier.project.pmv}/${artefact.caseMapIdentifier.name}`} caseMap={artefact} />
          )
        )}
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

const CaseMapCard = ({ caseMap }: { caseMap: CaseMapBean }) => {
  const { t } = useTranslation();
  const { deleteCaseMap } = useDeleteCaseMap();
  const { openEditor, removeEditor } = useEditors();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const { createCaseMapEditor } = useCreateEditor();
  const editor = createCaseMapEditor(caseMap);
  const { badgesFor } = useBadges();
  const badges = badgesFor(caseMap);
  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='casemap' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      badges={badges}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => {
            removeEditor(editor.id);
            deleteCaseMap(caseMap.caseMapIdentifier);
          },
          isDeletable: editor.project.isIar === false,
          message: t('message.caseMapPackaged'),
          artifact: t('artifact.type.casemap')
        }}
        {...dialogState}
      />
    </ArtifactCard>
  );
};

const useBadges = () => {
  const { t } = useTranslation();
  const allBadges = [t('common.label.readOnly'), t('label.callableSubProcess'), t('label.webServiceProcess'), t('label.caseMap')] as const;
  const badgesFor = (artifact: CaseMapBean | ProcessBean) => {
    const badges: Array<Badge> = [];
    if (
      (isProcessBean(artifact) && artifact.processIdentifier.project.isIar) ||
      (isCaseMapBean(artifact) && artifact.caseMapIdentifier.project.isIar)
    ) {
      badges.push({ label: allBadges[0], badgeStyle: 'secondary' });
    }
    if (isProcessBean(artifact)) {
      if (artifact.kind === 'CALLABLE_SUB') {
        badges.push({ label: allBadges[1], badgeStyle: 'orange' });
      }
      if (artifact.kind === 'WEB_SERVICE') {
        badges.push({ label: allBadges[2], badgeStyle: 'green' });
      }
    }
    if (isCaseMapBean(artifact)) {
      badges.push({ label: allBadges[3], badgeStyle: 'blue' });
    }
    return badges;
  };
  return { allBadges, badgesFor };
};

function isCaseMapBean(obj: CaseMapBean | ProcessBean): obj is CaseMapBean {
  return obj !== null && typeof obj === 'object' && 'caseMapIdentifier' in obj && typeof obj.caseMapIdentifier === 'object';
}

function isProcessBean(obj: CaseMapBean | ProcessBean): obj is ProcessBean {
  return (
    obj !== null && typeof obj === 'object' && 'processIdentifier' in obj && typeof obj.processIdentifier === 'object' && 'kind' in obj
  );
}
