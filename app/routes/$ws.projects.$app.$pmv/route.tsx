import { Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { MetaFunction } from '@remix-run/node';
import { useNavigate, useParams } from '@remix-run/react';
import { useMemo, useState, type ReactNode } from 'react';
import { useDependencies, useRemoveDependency } from '~/data/dependency-api';
import { useSortedProjects, type ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { Overview } from '~/neo/Overview';
import { useAddDependency } from '~/neo/project/useAddDependency';
import PreviewSVG from '../_index/workspace-preview.svg?react';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Poject Detail' }, { name: 'description', content: 'Axon Ivy Project Detail' }];
};

export default function Index() {
  const { app, pmv } = useParams();
  const [search, setSearch] = useState('');
  const projects = useSortedProjects();
  const project = useMemo(() => projects.data?.find(({ id }) => id.app === app && id.pmv === pmv), [app, pmv, projects.data]);
  const { data, isPending } = useDependencies(app, pmv);
  const dependencies = useMemo(() => data?.filter(d => d.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())), [data, search]);
  const open = useAddDependency();
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <Flex direction='column' gap={1}>
        <Flex direction='column' gap={4} style={{ fontSize: 16, padding: 30, paddingBottom: 0 }} className='project-detail'>
          <span style={{ fontWeight: 600 }}>Project detail: {project?.artifactId}</span>
          <span style={{ color: 'var(--N900)' }}>Here are the details related to your project.</span>
          <div className='project-detail-card' style={{ background: 'var(--N50)', padding: 10, borderRadius: 5 }}>
            <Flex direction='row' gap={4} style={{ flexWrap: 'wrap', columnGap: '150px' }}>
              <ProjectInfoContainer>
                <ProjectInfo title={'Name'} value={project?.artifactId}></ProjectInfo>
                <ProjectInfo title={'GroupId'} value={project?.groupId}></ProjectInfo>
              </ProjectInfoContainer>
              <ProjectInfoContainer>
                <ProjectInfo title={'Version'} value={project?.version}></ProjectInfo>
                <ProjectInfo title={'Editing rights'} value={project?.id.isIar ? 'Read only' : 'Write'}></ProjectInfo>
              </ProjectInfoContainer>
              <ProjectInfoContainer>
                <ProjectInfo title={'State'} value={project?.id.isIar ? 'Packed' : 'Unpacked'}></ProjectInfo>
                <ProjectInfo title={'Deletable'} value={project?.isDeletable ? 'Yes' : 'No'}></ProjectInfo>
              </ProjectInfoContainer>
            </Flex>
          </div>
        </Flex>
        <Overview title={`Required projects of: ${project?.artifactId}`} search={search} onSearchChange={setSearch} isPending={isPending}>
          {project && dependencies && (
            <>
              {!project.id.isIar && <NewArtifactCard title='Add Dependency' open={() => open(project.id)} icon={IvyIcons.Plus} />}
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
    message: 'The dependency cannot be deleted as the project at hand is packaged.'
  };
  return (
    <ArtifactCard name={dependency.pmv} type='dependency' actions={{ delete: deleteAction }} onClick={open} preview={<PreviewSVG />} />
  );
};
