import { DropdownMenuItem, Flex, Separator, Spinner, vars } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useNavigate, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useDependencies, useRemoveDependency } from '~/data/dependency-api';
import type { ProjectBean } from '~/data/generated/ivy-client';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
import type { Badge } from '~/neo/overview/artifact/ArtifactBadge';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewInfoCard } from '~/neo/overview/OverviewInfoCard';
import { OverviewRecentlyOpened } from '~/neo/overview/OverviewRecentlyOpened';
import { OverviewSortBy, useSortedArtifacts } from '~/neo/overview/OverviewSortBy';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { AddDependencyDialog } from './DependencyDialog';

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Project details - ${params.pmv} - ${params.ws} - ${NEO_DESIGNER}` },
    { name: 'description', content: 'Axon Ivy Project details' }
  ];
};

export default function Index() {
  const { t } = useTranslation();
  const { app, pmv } = useParams();
  const { data: projects, isPending: isProjectsPending } = useSortedProjects();
  const project = useMemo(() => projects?.find(({ id }) => id.app === app && id.pmv === pmv), [app, pmv, projects]);
  const { data: depencencies, isPending: isDependenciesPending } = useDependencies(app, pmv);
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(depencencies ?? [], (dep, search) =>
    dep.pmv.toLocaleLowerCase().includes(search)
  );
  const { sortedArtifacts, setSortDirection } = useSortedArtifacts(filteredAritfacts, projectBean => projectBean.pmv);

  if (isProjectsPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }
  if (project === undefined) {
    return null;
  }

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.projects') }, { name: project.id.pmv, menu: <BreadcrumbProjectSwitcher project={project} /> }]} />
      <OverviewTitle title={t('projects.details', { project: project.id.pmv })} />
      <Flex
        direction='row'
        gap={4}
        className='project-detail-card'
        style={{ flexWrap: 'wrap', columnGap: 50, background: 'var(--N50)', padding: 10, borderRadius: 'var(--border-r2)' }}
      >
        <ProjectInfoContainer>
          <ProjectInfo title={t('neo.artifactId')} value={project.artifactId} />
          <ProjectInfo title={t('neo.groupId')} value={project.groupId} />
        </ProjectInfoContainer>
        <ProjectInfoContainer>
          <ProjectInfo title={t('common.label.version')} value={project.version} />
          <ProjectInfo title={t('projects.editRights')} value={project.id.isIar ? t('common.label.readOnly') : t('project.editable')} />
        </ProjectInfoContainer>
        <ProjectInfoContainer>
          <ProjectInfo title={t('projects.deletable')} value={project.isDeletable ? t('common.label.yes') : t('common.label.no')} />
        </ProjectInfoContainer>
      </Flex>
      <Flex direction='row' gap={4} style={{ flexWrap: 'wrap' }}>
        <OverviewInfoCard
          title={t('neo.processes')}
          description={t('processes.processDescription')}
          icon={IvyIcons.Process}
          link={`../processes?p=${project.id.pmv}`}
        />
        <OverviewInfoCard
          title={t('neo.dataClasses')}
          description={t('dataclasses.dataclassDescription')}
          icon={IvyIcons.Database}
          link={`../dataClasses?p=${project.id.pmv}`}
        />
        <OverviewInfoCard
          title={t('neo.forms')}
          description={t('forms.formDescription')}
          icon={IvyIcons.File}
          link={`../forms?p=${project.id.pmv}`}
        />
        <OverviewInfoCard
          title={t('neo.configs')}
          description={t('configurations.configDescription')}
          icon={IvyIcons.Tool}
          link={`../configurations?p=${project.id.pmv}`}
        />
      </Flex>
      <Separator style={{ marginBlock: vars.size.s2, flex: '0 0 1px' }} />
      <OverviewRecentlyOpened filter={e => e.project.pmv === project.id.pmv} />
      <OverviewTitle title={t('projects.dependency')} description={t('projects.dependencyInfo')}>
        <AddDependencyDialog project={project.id} />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter}>
        <OverviewSortBy setSortDirection={setSortDirection} />
      </OverviewFilter>
      <OverviewContent isPending={isDependenciesPending}>
        {sortedArtifacts?.map(dep => (
          <DependencyCard key={dep.pmv} dependency={dep} project={project.id} />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const ProjectInfoContainer = ({ children }: { children: ReactNode }) => (
  <Flex direction='column' gap={2} style={{ fontSize: 14, flex: 1 }}>
    {children}
  </Flex>
);

const ProjectInfo = ({ title, value }: { title: string; value?: string }) => (
  <Flex direction='row' gap={4}>
    <span style={{ color: 'var(--N700)' }}>{title}:</span>
    <span>{value}</span>
  </Flex>
);

const DependencyCard = ({ project, dependency }: { project: ProjectIdentifier; dependency: ProjectIdentifier }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { removeDependency } = useRemoveDependency();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const { badgesFor } = useBadges();
  const badges = badgesFor(dependency);

  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={dependency.pmv}
      onClick={() => navigate(`../projects/${dependency.app}/${dependency.pmv}`)}
      preview={<PreviewSvg type='workspace' />}
      badges={badges}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => removeDependency(project, dependency),
          isDeletable: project.isIar ? false : true,
          message: t('message.dependencyPackaged'),
          label: t('label.removeDependency'),
          artifact: t('artifact.type.dependency')
        }}
        {...dialogState}
      />
    </ArtifactCard>
  );
};

const useBadges = () => {
  const { t } = useTranslation();
  const allBadges = [t('common.label.readOnly')] as const;
  const badgesFor = (dependency: ProjectIdentifier) => {
    const badges: Array<Badge> = [];
    if (dependency.isIar) {
      badges.push({ label: allBadges[0], badgeStyle: 'secondary' });
    }
    return badges;
  };
  return { allBadges, badgesFor };
};

const BreadcrumbProjectSwitcher = ({ project }: { project: ProjectBean }) => {
  const projects = useSortedProjects().data?.filter(p => p.id !== project.id);
  const nav = useNavigate();
  return (
    <>
      {projects?.map(project => (
        <DropdownMenuItem key={project.id.pmv} onClick={() => nav(`../${project.id.pmv}`, { relative: 'path' })}>
          {project.id.pmv}
        </DropdownMenuItem>
      ))}
    </>
  );
};
