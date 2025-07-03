import { BasicDialog, Button, DialogTrigger, Flex, useHotkeyLocalScopes } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useNavigate, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useAddDependencyReq, useDependencies, useRemoveDependency } from '~/data/dependency-api';
import type { ProjectBean } from '~/data/generated/ivy-client';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { PreviewSvg } from '~/neo/artifact/PreviewSvg';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Overview } from '~/neo/Overview';
import { useSearch } from '~/neo/useSearch';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Project details - ${params.pmv} - ${params.ws} - ${NEO_DESIGNER}` },
    { name: 'description', content: 'Axon Ivy Project details' }
  ];
};

export default function Index() {
  const { t } = useTranslation();
  const { app, pmv } = useParams();
  const { search, setSearch } = useSearch();
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['addDependencyDialog']);
  const projects = useSortedProjects();
  const project = useMemo(() => projects.data?.find(({ id }) => id.app === app && id.pmv === pmv), [app, pmv, projects.data]);
  const { data, isPending } = useDependencies(app, pmv);
  const dependencies = useMemo(() => data?.filter(d => d.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())), [data, search]);
  const [addDependencyDialog, setAddDependencyDialog] = useState(false);
  const onDialogOpenChange = (open: boolean) => {
    setAddDependencyDialog(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <Flex direction='column' gap={1}>
        <Flex direction='column' gap={4} style={{ fontSize: 16, padding: 30, paddingBottom: 0 }} className='project-detail'>
          <span style={{ fontWeight: 600 }}>{t('projects.details', { project: project?.id.pmv })}</span>
          <div className='project-detail-card' style={{ background: 'var(--N50)', padding: 10, borderRadius: 5 }}>
            <Flex direction='row' gap={4} style={{ flexWrap: 'wrap', columnGap: '150px' }}>
              <ProjectInfoContainer>
                <ProjectInfo title={t('neo.artifactId')} value={project?.artifactId}></ProjectInfo>
                <ProjectInfo title={t('neo.groupId')} value={project?.groupId}></ProjectInfo>
              </ProjectInfoContainer>
              <ProjectInfoContainer>
                <ProjectInfo title={t('common.label.version')} value={project?.version}></ProjectInfo>
                <ProjectInfo
                  title={t('projects.editRights')}
                  value={project?.id.isIar ? t('common.label.readOnly') : t('project.editable')}
                ></ProjectInfo>
              </ProjectInfoContainer>
              <ProjectInfoContainer>
                <ProjectInfo
                  title={t('projects.deletable')}
                  value={project?.isDeletable ? t('common.label.yes') : t('common.label.no')}
                ></ProjectInfo>
              </ProjectInfoContainer>
            </Flex>
          </div>
        </Flex>
        <Overview
          title={t('projects.dependencyDetails', { project: project?.id.pmv })}
          description={t('projects.description')}
          info={t('projects.dependecyInfo')}
          search={search}
          onSearchChange={setSearch}
          isPending={isPending}
        >
          {project && dependencies && (
            <>
              {!project.id.isIar && (
                <AddDependencyDialog project={project.id} open={addDependencyDialog} onOpenChange={onDialogOpenChange}>
                  <NewArtifactCard title={t('projects.addDependency')} open={() => onDialogOpenChange(true)} />
                </AddDependencyDialog>
              )}
              {dependencies.map(dep => (
                <DependencyCard key={dep.pmv} dependency={dep} project={project?.id} />
              ))}
            </>
          )}
        </Overview>
      </Flex>
    </div>
  );
}

const ProjectInfoContainer = ({ children }: { children: ReactNode }) => (
  <Flex direction='column' gap={2}>
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
  const open = () => {
    navigate(`../projects/${dependency.app}/${dependency.pmv}`);
  };
  const deleteAction = {
    run: () => {
      removeDependency(project, dependency);
    },
    isDeletable: project.isIar ? false : true,
    message: t('message.dependencyPackaged'),
    label: t('label.removeDependency')
  };
  return (
    <ArtifactCard
      name={dependency.pmv}
      type='dependency'
      actions={{ delete: deleteAction }}
      onClick={open}
      preview={<PreviewSvg type='workspace' />}
      tagLabel={dependency.isIar ? t('common.label.readOnly') : undefined}
    />
  );
};

const AddDependencyDialog = ({
  children,
  project,
  open,
  onOpenChange
}: {
  children: ReactNode;
  project: ProjectIdentifier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [dependency, setDependency] = useState<ProjectBean>();
  const { addDependency } = useAddDependencyReq();
  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      contentProps={{
        title: t('projects.addDependencyTo', { project: project.pmv }),
        description: '',
        buttonClose: (
          <Button variant='outline' size='large' icon={IvyIcons.Close}>
            {t('common.label.cancel')}
          </Button>
        ),
        buttonCustom: (
          <Button variant='primary' size='large' onClick={() => dependency && addDependency(project, dependency.id)} icon={IvyIcons.Plus}>
            {t('common.label.add')}
          </Button>
        )
      }}
      dialogTrigger={
        <DialogTrigger asChild>
          <div>{children}</div>
        </DialogTrigger>
      }
    >
      <ProjectSelect
        setProject={setDependency}
        setDefaultValue={true}
        projectFilter={p => p.id.pmv !== project.pmv}
        label={t('projects.selectDependency')}
      ></ProjectSelect>
    </BasicDialog>
  );
};
