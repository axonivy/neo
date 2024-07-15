import { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { ProcessIdentifier, useCreateProcess, useDeleteProcess, useProcesses } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { Editor, useCreateEditor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import ProcessPreviewSVG from './process-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProcesses();
  const { createProcessEditor } = useCreateEditor();
  const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Overview title='Processes' search={search} onSearchChange={setSearch} isPending={isPending}>
      <NewProcessCard />
      {processes.map(process => {
        const editor = createProcessEditor(process);
        return <ProcessCard key={editor.id} processId={process.processIdentifier} {...editor} />;
      })}
    </Overview>
  );
}

export const ProcessCard = ({ processId, ...editor }: Editor & { processId: ProcessIdentifier }) => {
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteProcess(processId);
  };
  return (
    <ArtifactCard name={editor.name} type='process' preview={<ProcessPreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />
  );
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
