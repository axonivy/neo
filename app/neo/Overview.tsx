import { Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import type { ReactNode } from 'react';

type OverviewProps = {
  title: string;
  description?: string;
  search: string;
  onSearchChange: (search: string) => void;
  isPending: boolean;
  children: ReactNode;
};

export const Overview = ({ title, description, search, onSearchChange, isPending, children }: OverviewProps) => (
  <Flex
    direction='column'
    gap={4}
    style={{ fontSize: 16, padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}
    className='overview'
  >
    <span style={{ fontWeight: 600 }}>{title}</span>
    {description && <span style={{ fontWeight: 400, color: 'var(--N900)' }}>{description}</span>}
    <SearchInput placeholder='Search' value={search} onChange={onSearchChange} />
    <Flex gap={4} style={{ flexWrap: 'wrap' }}>
      {isPending ? <Spinner size='small' className='overview-loader' /> : <>{children}</>}
    </Flex>
  </Flex>
);
