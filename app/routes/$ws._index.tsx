import { Separator, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { MetaFunction } from '@remix-run/node';
import { useNavigate, useParams } from '@remix-run/react';
import { useState } from 'react';
import { useSortedProjects } from '~/data/project-api';
import { ArtifactCard, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { useImportProjects } from '~/neo/artifact/useImportProjects';
import { Overview } from '~/neo/Overview';
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
  return (
    <Overview title={title} description={description} search={search} onSearchChange={setSearch} isPending={isPending}>
      <div style={{ width: '100%' }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Projects</span>
        <Separator style={{ marginBlock: '10px' }}></Separator>
      </div>
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
  );
}
