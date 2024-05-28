import { Flex, IvyIcon, SearchInput } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useProcesses } from '~/data/processes';

import processStyles from '~/styles/processes.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: processStyles }];

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

const ProcessCard = ({ name, path }: { name: string; path: string }) => {
  const navigate = useNavigate();
  return (
    <Flex
      direction='column'
      justifyContent='space-between'
      gap={2}
      style={{ background: 'var(--N75)', padding: 'var(--size-2)', borderRadius: 10, height: 150, flex: '0 1 200px' }}
      onClick={() => navigate(`/processes/${path}`)}
    >
      <div style={{ background: 'var(--background)', borderRadius: 8, flex: '1 0 auto' }}>
        <img className='process-preview' src='/process.svg' alt='process-prev' />
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
  const processes = useProcesses().filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <span style={{ fontWeight: 600, fontSize: 16 }}>Processes</span>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {processes.map(process => (
          <ProcessCard key={process.path ?? process.name} {...process} />
        ))}
      </Flex>
    </Flex>
  );
}
