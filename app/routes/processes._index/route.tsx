import { Flex, Button, SearchInput, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useProcesses, useDeleteProcess, useCreateProcess, Process } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks } from '~/neo/card/ArtifactCard';
import { useNewArtifactDialog } from '~/neo/dialog/useNewArtifactDialog';
import { useEditors, editorId, editorIcon } from '~/neo/useEditors';
import ProcessPreviewSVG from './process-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProcesses();
  const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const { createProcess } = useCreateProcess();
  const { open } = useNewArtifactDialog();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project });
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <Flex direction='row' alignItems='center' justifyContent='space-between'>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Processes</span>
        <Button
          icon={IvyIcons.Plus}
          size='large'
          onClick={() => open({ create, title: 'Create new Process', defaultName: 'MyNewProcess' })}
        />
      </Flex>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isPending ? <Spinner size='small' /> : processes.map(process => <ProcessCard key={process.path ?? process.name} {...process} />)}
      </Flex>
    </Flex>
  );
}

export const ProcessCard = ({ name, path, processIdentifier }: Process) => {
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const project = processIdentifier.project;
  const id = editorId('processes', project, path);
  const open = () => {
    openEditor({ id, type: 'processes', icon: editorIcon('processes'), name, project, path });
  };
  const deleteAction = () => {
    removeEditor(id);
    deleteProcess(processIdentifier);
  };
  return <ArtifactCard name={name} type='process' preview={<ProcessPreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />;
};
