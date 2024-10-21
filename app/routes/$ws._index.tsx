import { Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { MetaFunction } from '@remix-run/node';
import { useNavigate, useParams } from '@remix-run/react';
import { useState } from 'react';
import type { ProjectBean } from '~/data/generated/openapi-dev';
import { useDeleteProject, useSortedProjects } from '~/data/project-api';
import { ArtifactCard, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactInfoCard } from '~/neo/artifact/ArtifactInfoCard';
import { Overview } from '~/neo/Overview';
import { useImportProjects } from '~/neo/workspace/useImportProjects';
import PreviewSVG from './_index/workspace-preview.svg?react';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

const overviewDescription =
  'Here you can find the projects you have created along with any imported projects in this workspace. A project contains all the essential components needed to build an application.';
const processDescription =
  'A process describes a sequence of automated steps that optimize workflows and enables efficient task management within an application.';
const dataClassDescription =
  'A data class is used to define and structure the data within a process application. It is used to manage data consistently across processes and forms.';
const formDescription =
  'A form is a user interface element that facilitates data entry and interaction with the application, acting as a bridge between users and the system.';
const configDescription =
  'Configurations are the settings and parameters that define how an application behaves and interacts with other systems.';

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useSortedProjects();
  const { ws } = useParams();
  const navigate = useNavigate();
  const open = useImportProjects();
  const projects = data?.filter(({ id }) => id.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const title = `Welcome to your workspace: ${ws}`;
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <Flex direction='column' gap={1}>
        <Flex direction='column' gap={4} style={{ fontSize: 16, padding: 30, paddingBottom: 0 }} className='app-info'>
          <span style={{ fontWeight: 600 }}>{title}</span>
          <span style={{ fontWeight: 400, color: 'var(--N900)' }}>{overviewDescription}</span>
          <Flex direction='row' gap={4} style={{ flexWrap: 'wrap' }}>
            <ArtifactInfoCard title='Processes' description={processDescription} icon={IvyIcons.Process} link='processes' />
            <ArtifactInfoCard title='Data Classes' description={dataClassDescription} icon={IvyIcons.Database} link='dataClasses' />
            <ArtifactInfoCard title='Forms' description={formDescription} icon={IvyIcons.File} link='forms' />
            <ArtifactInfoCard title='Configurations' description={configDescription} icon={IvyIcons.Tool} link='configurations' />
          </Flex>
        </Flex>
        <Overview title={'Projects'} search={search} onSearchChange={setSearch} isPending={isPending}>
          <NewArtifactCard title='Market' open={() => navigate('market')} icon={IvyIcons.Download} />
          <NewArtifactCard title='File Import' open={() => open()} icon={IvyIcons.Download} />
          {projects.map(p => (
            <ProjectCard key={p.id.pmv} project={p} />
          ))}
        </Overview>
      </Flex>
    </div>
  );
}

const ProjectCard = ({ project }: { project: ProjectBean }) => {
  const navigate = useNavigate();
  const { deleteProject } = useDeleteProject();

  const open = () => {
    navigate(`projects/${project.id.app}/${project.id.pmv}`);
  };
  const deleteAction = {
    run: () => {
      deleteProject(project.id);
    },
    isDeletable: project.isDeletable,
    message: project.isDeletable ? '' : 'The project cannot be deleted as it is required by other projects in the workspace.'
  };
  return (
    <ArtifactCard name={project.artifactId} type='project' actions={{ delete: deleteAction }} onClick={open} preview={<PreviewSVG />} />
  );
};
