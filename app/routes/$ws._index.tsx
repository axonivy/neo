import { Flex, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { MetaFunction } from '@remix-run/node';
import { useNavigate, useParams } from '@remix-run/react';
import { useState } from 'react';
import { useSortedProjects } from '~/data/project-api';
import { ArtifactCard, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactInfoCard } from '~/neo/artifact/ArtifactInfoCard';
import { Overview } from '~/neo/Overview';
import { useImportProjects } from '~/neo/workspace/useImportProjects';
import PreviewSVG from './_index/workspace-preview.svg?react';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useSortedProjects();
  const { ws } = useParams();
  const navigate = useNavigate();
  const open = useImportProjects();
  const projects = data?.filter(p => p.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const description =
    'Here you will find all the projects you have created or imported. Create a new project by clicking on the blue box and open an existing one by clicking on one of the grey boxes.';
  const title = `Welcome to your application: ${ws}`;
  const dummyDescription =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet pellentesque massa. Proin iaculis odio at orci aliquet, vitae maximus sem congue. Suspendisse potenti. ';
  return (
    <Flex direction='column'>
      <Overview title={title} description={description} isPending={false}>
        <Flex direction='row' gap={4} style={{ flexWrap: 'wrap' }}>
          <ArtifactInfoCard title='Processes' description={dummyDescription} icon={IvyIcons.Process} link='processes' />
          <ArtifactInfoCard title='Data Classes' description={dummyDescription} icon={IvyIcons.Database} link='dataClasses' />
          <ArtifactInfoCard title='Forms' description={dummyDescription} icon={IvyIcons.File} link='forms' />
          <ArtifactInfoCard title='Configurations' description={dummyDescription} icon={IvyIcons.Tool} link='forms' />
        </Flex>
      </Overview>
      <Overview title={'Projects'} search={search} onSearchChange={setSearch} isPending={isPending}>
        <NewArtifactCard title='Market' open={() => navigate('market')} icon={IvyIcons.Download} />
        <NewArtifactCard title='Import' open={() => open()} icon={IvyIcons.Download} />
        {projects.map(project => (
          <ArtifactCard
            key={project.pmv}
            name={project.pmv}
            type='project'
            onClick={() => toast.error('Open project not implemented')}
            preview={<PreviewSVG />}
          />
        ))}
      </Overview>
    </Flex>
  );
}
