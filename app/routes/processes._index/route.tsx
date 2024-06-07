import { Flex, IvyIcon, SearchInput, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useProcesses } from '~/data/process-api';
import ProcessPreviewSVG from './process-preview.svg?react';
import processStyles from './processes.css?url';
import { editorId, useEditors } from '~/neo/useEditors';
import { NewProcessPopup } from './NewProcessPopup';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: processStyles }];

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

const ProcessCard = ({ name, path }: { name: string; path: string }) => {
  const { openEditor } = useEditors();
  const id = editorId('processes', path);
  return (
    <Flex
      direction='column'
      justifyContent='space-between'
      gap={2}
      style={{ background: 'var(--N75)', padding: 'var(--size-2)', borderRadius: 10, height: 150, flex: '0 1 200px' }}
      onClick={() => openEditor({ type: 'processes', icon: IvyIcons.Process, name, id })}
    >
      <div style={{ background: 'var(--background)', borderRadius: 8, flex: '1 0 auto' }}>
        <ProcessPreviewSVG className='process-preview' />
      </div>
      <Flex alignItems='center' justifyContent='space-between' gap={1}>
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 'calc(200px - var(--size-1) - 12px)' }}>{name}</span>
        <IvyIcon icon={IvyIcons.ArrowRight} />
      </Flex>
    </Flex>
  );
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProcesses();
  const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <Flex direction='row' alignItems='center' justifyContent='space-between'>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Processes</span>
        <NewProcessPopup />
      </Flex>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isLoading && <Spinner size='small' />}
        {processes.map(process => (
          <ProcessCard key={process.path ?? process.name} {...process} />
        ))}
      </Flex>
    </Flex>
  );
}
