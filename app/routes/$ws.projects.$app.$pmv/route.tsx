import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
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
  const project = useMemo(() => projects.data?.find(p => p.app === app && p.pmv === pmv), [app, pmv, projects.data]);
  const { data, isPending } = useGroupedProcesses();
  const processes = useMemo(
    () =>
      data?.find(g => g.project === project?.pmv)?.artifacts.filter(p => p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
    [data, project?.pmv, search]
  );
  const { createProcessEditor } = useCreateEditor();
  return (
    <Overview
      title={`Project details of: ${project?.pmv}`}
      description='Here you will find project related details.'
      search={search}
      onSearchChange={setSearch}
      isPending={isPending}
    >
      {processes?.map(process => {
        const editor = createProcessEditor(process);
        return <ProcessCard key={editor.id} processId={process.processIdentifier} {...editor} />;
      })}
    </Overview>
  );
}
