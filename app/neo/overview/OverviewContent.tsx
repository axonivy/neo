import { Flex, Spinner } from '@axonivy/ui-components';
import type { ReactNode } from 'react';
import type { ViewTypes } from './OverviewFilter';

type OverviewContentProps = {
  children: ReactNode;
  isPending: boolean;
  viewType?: ViewTypes;
  viewTypes?: Record<Exclude<ViewTypes, 'tile'>, ReactNode>;
};

export const OverviewContent = ({ children, isPending, viewType = 'tile', viewTypes }: OverviewContentProps) => {
  if (isPending) {
    return <Spinner size='small' className='overview-loader' />;
  }
  return (
    <>
      {viewType === 'graph' && viewTypes?.graph}
      {viewType === 'tile' && <OverviewTiles>{children}</OverviewTiles>}
    </>
  );
};

export const OverviewTiles = ({ children }: { children: ReactNode }) => (
  <Flex gap={4} style={{ flexWrap: 'wrap' }}>
    {children}
  </Flex>
);
