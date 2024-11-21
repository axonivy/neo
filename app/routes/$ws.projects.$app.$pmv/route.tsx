import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useNavigate, useParams } from '@remix-run/react';
import { useMemo, useState, type ReactNode } from 'react';
import { NEO_DESIGNER } from '~/constants';
import { useAddDependencyReq, useDependencies, useRemoveDependency } from '~/data/dependency-api';
import type { ProjectBean } from '~/data/generated/openapi-dev';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Overview } from '~/neo/Overview';
import { useSearch } from '~/neo/useSearch';
import PreviewSVG from '../_index/workspace-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Project details - ${params.pmv} - ${params.ws} - ${NEO_DESIGNER}` },
    { name: 'description', content: 'Axon Ivy Project details' }
  ];
};

export default function Index() {
  const { app, pmv } = useParams();
  const { search, setSearch } = useSearch();
  const projects = useSortedProjects();
  const project = useMemo(() => projects.data?.find(({ id }) => id.app === app && id.pmv === pmv), [app, pmv, projects.data]);
  const { data, isPending } = useDependencies(app, pmv);
  const dependencies = useMemo(() => data?.filter(d => d.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())), [data, search]);
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <Flex direction='column' gap={1}>
        <Flex direction='column' gap={4} style={{ fontSize: 16, padding: 30, paddingBottom: 0 }} className='project-detail'>
          <span style={{ fontWeight: 600 }}>Project details: {project?.id.pmv}</span>
          <div className='project-detail-card' style={{ background: 'var(--N50)', padding: 10, borderRadius: 5 }}>
            <Flex direction='row' gap={4} style={{ flexWrap: 'wrap', columnGap: '150px' }}>
              <ProjectInfoContainer>
                <ProjectInfo title={'ArtifactId'} value={project?.artifactId}></ProjectInfo>
                <ProjectInfo title={'GroupId'} value={project?.groupId}></ProjectInfo>
              </ProjectInfoContainer>
              <ProjectInfoContainer>
                <ProjectInfo title={'Version'} value={project?.version}></ProjectInfo>
                <ProjectInfo title={'Editing rights'} value={project?.id.isIar ? 'Read only' : 'Editable'}></ProjectInfo>
              </ProjectInfoContainer>
              <ProjectInfoContainer>
                <ProjectInfo title={'Deletable'} value={project?.isDeletable ? 'Yes' : 'No'}></ProjectInfo>
              </ProjectInfoContainer>
            </Flex>
          </div>
        </Flex>
        <Overview
          title={`Dependency details of: ${project?.id.pmv}`}
          description='Here you can view the project dependencies.'
          info='Dependencies are links between projects which allow one project to access the functionality or artefacts of another and avoid duplicating work.'
          search={search}
          onSearchChange={setSearch}
          isPending={isPending}
        >
          {project && dependencies && (
            <>
              {!project.id.isIar && (
                <AddDependencyDialog project={project.id}>
                  <NewArtifactCard title={'Add new Dependency'} open={() => {}} />
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
    message: 'The dependency cannot be deleted as the project at hand is packaged.',
    label: 'Remove Dependency'
  };
  return (
    <ArtifactCard
      name={dependency.pmv}
      type='dependency'
      actions={{ delete: deleteAction }}
      onClick={open}
      preview={<PreviewSVG />}
      tagLabel={dependency.isIar ? 'Read only' : undefined}
    />
  );
};

const AddDependencyDialog = ({ children, project }: { children: ReactNode; project: ProjectIdentifier }) => {
  const [dependency, setDependency] = useState<ProjectBean>();
  const { addDependency } = useAddDependencyReq();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add dependency to: {project.pmv}</DialogTitle>
        </DialogHeader>
        <ProjectSelect
          setProject={setDependency}
          setDefaultValue={true}
          projectFilter={p => p.id.pmv !== project.pmv}
          label='Select dependency'
        ></ProjectSelect>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='primary' size='large' onClick={() => dependency && addDependency(project, dependency.id)} icon={IvyIcons.Plus}>
              Add
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant='outline' size='large' icon={IvyIcons.Close}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
