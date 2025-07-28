import { Flex } from '@axonivy/ui-components';
import type { ReactNode } from 'react';
import { InfoPopover } from './InfoPopover';

type OverviewTitleProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export const OverviewTitle = ({ title, description, children }: OverviewTitleProps) => (
  <Flex direction='row' alignItems='center' justifyContent='space-between' gap={4} className='overview-title-section'>
    <Flex direction='row' gap={1}>
      <span style={{ fontWeight: 600 }} className='overview-title'>
        {title}
      </span>
      {description && <InfoPopover info={description} />}
    </Flex>
    {children}
  </Flex>
);
