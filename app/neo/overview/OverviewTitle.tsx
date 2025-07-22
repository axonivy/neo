import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ReactNode } from 'react';
import { InfoPopover } from './InfoPopover';

type OverviewTitleProps = {
  title?: string;
  description?: string;
  info?: string;
  helpUrl?: string;
  children?: ReactNode;
};

export const OverviewTitle = ({ title, description, info, helpUrl, children }: OverviewTitleProps) => (
  <Flex direction='row' justifyContent='space-between' gap={4} className='overview-title-section'>
    <Flex direction='column' gap={1}>
      {title && (
        <span style={{ fontWeight: 600 }} className='overview-title'>
          {title}
        </span>
      )}
      {description && (
        <Flex direction='row' gap={1} style={{ fontWeight: 400, fontSize: 14, color: 'var(--N900)' }}>
          <span className='overview-description'>{description}</span>
          {info && <InfoPopover info={info} />}
          {helpUrl && <HelpButton url={helpUrl} />}
        </Flex>
      )}
    </Flex>
    {children}
  </Flex>
);

const HelpButton = ({ url }: { url: string }) => (
  <Button size='small' style={{ color: 'var(--P300)' }} icon={IvyIcons.Help} onClick={() => window.open(url, '_blank')} />
);
