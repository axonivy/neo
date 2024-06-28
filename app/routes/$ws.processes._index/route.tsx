import { Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useProcesses, useDeleteProcess, useCreateProcess, Process } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, NewArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import { useEditors, createProcessEditor } from '~/neo/editors/useEditors';
import ProcessPreviewSVG from './process-preview.svg?react';
import { useParams } from '@remix-run/react';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProcesses();
  const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <span style={{ fontWeight: 600, fontSize: 16 }}>Processes</span>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isPending ? (
          <Spinner size='small' />
        ) : (
          <>
            <NewProcessCard />
            {processes.map(process => (
              <ProcessCard key={process.path ?? process.name} {...process} />
            ))}
          </>
        )}
      </Flex>
    </Flex>
  );
}

const ProcessCard = (process: Process) => {
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const ws = useParams().ws ?? 'designer';
  const editor = createProcessEditor({ ws, ...process });
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteProcess(process.processIdentifier);
  };
  return (
    <ArtifactCard name={editor.name} type='process' preview={<ProcessPreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />
  );
};

const NewProcessCard = () => {
  const open = useNewArtifact();
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const ws = useParams().ws ?? 'designer';
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project }).then(process =>
      openEditor(createProcessEditor({ ws, ...process }))
    );
  const title = 'Create new Process';
  return <NewArtifactCard title={title} open={() => open({ create, title, defaultName: 'MyNewProcess' })} />;
};
