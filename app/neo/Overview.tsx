/* eslint-disable jsx-a11y/no-autofocus */
import { Button, Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoPopover } from './InfoPopover';

type OverviewProps = {
  title?: string;
  description?: string;
  search: string;
  onSearchChange: (search: string) => void;
  isPending: boolean;
  children: ReactNode;
  info?: string;
  helpUrl?: string;
};

export const Overview = ({ title, description, search, onSearchChange, isPending, children, info, helpUrl }: OverviewProps) => {
  const { t } = useTranslation();
  return (
    <Flex
      direction='column'
      gap={4}
      style={{ fontSize: 16, padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}
      className='overview'
    >
      {title && <span style={{ fontWeight: 600 }}>{title}</span>}
      {description && (
        <Flex direction='row' gap={1}>
          <span style={{ fontWeight: 400, color: 'var(--N900)' }}>{description}</span>
          {info && <InfoPopover info={info} />}
          {helpUrl && <HelpButton url={helpUrl} />}
        </Flex>
      )}
      <SearchInput placeholder={t('common.label.search')} value={search} onChange={onSearchChange} autoFocus={true} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isPending ? <Spinner size='small' className='overview-loader' /> : <>{children}</>}
      </Flex>
    </Flex>
  );
};

const HelpButton = ({ url }: { url: string }) => (
  <Button size='small' style={{ color: 'var(--P300)' }} icon={IvyIcons.Help} onClick={() => window.open(url, '_blank')} />
);
