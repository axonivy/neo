import { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { ProcessBean } from '~/data/generated/openapi-dev';
import { ProcessIdentifier, useCreateProcess, useDeleteProcess, useProcesses } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactSeparator } from '~/neo/artifact/ArtifactSeparator';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { Editor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './process-preview.svg?react';
import { useGroupedProcesses } from './useGroupedProcesses';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const { ws } = useParams();
  const [search, setSearch] = useState('');
  const { data, isPending } = useProcesses();
  const processes = useMemo(
    () => data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [],
    [data, search]
  );
  const groupedProcesses = useGroupedProcesses(processes);
  return (
    <Overview title='Processes' search={search} onSearchChange={setSearch} isPending={isPending}>
      {ws && !groupedProcesses[ws] && <ProcessGroup key={ws} project={ws} processes={[]} ws={ws} />}
      {Object.entries(groupedProcesses).map(([project, artifacts]) => (
        <ProcessGroup key={project} project={project} processes={artifacts} ws={ws} />
      ))}
    </Overview>
  );
}

const ProcessGroup = ({ project, processes, ws }: { project: string; processes: ProcessBean[]; ws?: string }) => {
  const { createProcessEditor } = useCreateEditor();
  return (
    <>
      <ArtifactSeparator title={project} />
      {ws === project && <NewProcessCard />}
      {processes.map(process => {
        const editor = createProcessEditor(process);
        return <ProcessCard key={editor.id} processId={process.processIdentifier} {...editor} />;
      })}
    </>
  );
};

const ProcessCard = ({ processId, ...editor }: Editor & { processId: ProcessIdentifier }) => {
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteProcess(processId);
  };
  return <ArtifactCard name={editor.name} type='process' preview={<PreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />;
};

const NewProcessCard = () => {
  const open = useNewArtifact();
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project }).then(process => openEditor(createProcessEditor(process)));
  const title = 'Create new Process';
  return <NewArtifactCard title={title} open={() => open({ create, title, defaultName: 'MyNewProcess' })} />;
};
