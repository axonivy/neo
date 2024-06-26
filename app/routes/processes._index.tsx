import { Button, Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useCreateProcess, useDeleteProcess, useProcesses } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ProjectArtifactCard, cardLinks } from '~/neo/card/ProjectArtifactCard';
import { useNewArtifactDialog } from '~/neo/dialog/useNewArtifactDialog';

export const links: LinksFunction = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProcesses();
  const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const { deleteProcess } = useDeleteProcess();
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
        {isPending ? (
          <Spinner size='small' />
        ) : (
          processes.map(process => (
            <ProjectArtifactCard
              key={process.path ?? process.name}
              project={process.processIdentifier.project}
              editorType={'processes'}
              {...process}
              actions={{ delete: () => deleteProcess(process.processIdentifier) }}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
}
