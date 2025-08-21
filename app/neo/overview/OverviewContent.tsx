import { Flex, PanelMessage, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { t } from 'i18next';
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
  if (Array.isArray(children) && children.length === 0) {
    return <PanelMessage icon={IvyIcons.Search} message={t('message.noArtifactsFound')} mode='column' />;
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
