import { Flex } from '@axonivy/ui-components';
import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useMemo, useState, type ReactNode } from 'react';
import { useGroupedProcesses } from '~/data/process-api';
import { useSortedProjects } from '~/data/project-api';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { Overview } from '~/neo/Overview';
import { ProcessCard } from '../$ws.processes._index/route';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Poject Detail' }, { name: 'description', content: 'Axon Ivy Project Detail' }];
};

export default function Index() {
  const { app, pmv } = useParams();
  const [search, setSearch] = useState('');
  const projects = useSortedProjects();
  const project = useMemo(() => projects.data?.find(({ id }) => id.app === app && id.pmv === pmv), [app, pmv, projects.data]);
  const { data, isPending } = useGroupedProcesses();
  const processes = useMemo(
    () =>
      data
        ?.find(g => g.project === project?.id.pmv)
        ?.artifacts.filter(p => p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
    [data, project?.id.pmv, search]
  );
  const { createProcessEditor } = useCreateEditor();
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
        <Overview title={`Processes of: ${project?.artifactId}`} search={search} onSearchChange={setSearch} isPending={isPending}>
          {processes?.map(process => {
            const editor = createProcessEditor(process);
            return <ProcessCard key={editor.id} processId={process.processIdentifier} {...editor} />;
          })}
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
