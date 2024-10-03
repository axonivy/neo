import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useState } from 'react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { ArtifactCard } from '~/neo/artifact/ArtifactCard';
import { Overview } from '~/neo/Overview';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProjects();
  const projects = data?.filter(p => p.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const params = useParams();
  const description =
    'Here you will find all the projects you have created or imported. Create a new project by clicking on the blue box and open an existing one by clicking on one of the grey boxes.';
  return (
    <Overview
      title={`Welcome to your application: ${params.ws}`}
      description={description}
      search={search}
      onSearchChange={setSearch}
      isPending={isPending}
    >
      {projects.map(project => (
        <ProjectCard key={project.pmv} {...project} />
      ))}
    </Overview>
  );
}

const ProjectCard = (project: ProjectIdentifier) => {
  const deleteAction = () => {};
  return <ArtifactCard name={project.pmv} type='project' actions={{ delete: deleteAction }} onClick={() => {}} />;
};
