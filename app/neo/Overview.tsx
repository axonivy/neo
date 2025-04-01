/* eslint-disable jsx-a11y/no-autofocus */
import { Button, Field, Flex, Label, SearchInput, Spinner, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoPopover } from './InfoPopover';

type OverviewProps = {
  title?: string;
  description?: string;
  search: string;
  onSearchChange: (search: string) => void;
  isPending: boolean;
  children: ReactNode;
  graph?: ReactNode;
  info?: string;
  helpUrl?: string;
};

export const Overview = ({ title, description, search, onSearchChange, isPending, children, info, helpUrl, graph }: OverviewProps) => {
  const { t } = useTranslation();
  const [showGraph, setShowGraph] = useState(false);
  return (
    <Flex
      direction='column'
      gap={4}
      style={{ fontSize: 16, padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}
      className='overview'
    >
      <Flex direction='row' alignItems='center' justifyContent='space-between'>
        {title && <span style={{ fontWeight: 600 }}>{title}</span>}

        {graph && (
          <Field direction='row' alignItems='center' gap={2}>
            <Label>{t('label.showGraph', { title: title })}</Label>
            <Switch checked={showGraph} onCheckedChange={setShowGraph} />
          </Field>
        )}
      </Flex>
      {description && (
        <Flex direction='row' gap={1}>
          <span style={{ fontWeight: 400, color: 'var(--N900)' }}>{description}</span>
          {info && <InfoPopover info={info} />}
          {helpUrl && <HelpButton url={helpUrl} />}
        </Flex>
      )}
      {graph && showGraph ? (
        graph
      ) : (
        <>
          <SearchInput placeholder={t('common:label.search')} value={search} onChange={onSearchChange} autoFocus={true} />
          <Flex gap={4} style={{ flexWrap: 'wrap' }}>
            {isPending ? <Spinner size='small' className='overview-loader' /> : <>{children}</>}
          </Flex>
        </>
      )}
    </Flex>
  );
};

const HelpButton = ({ url }: { url: string }) => (
  <Button size='small' style={{ color: 'var(--P300)' }} icon={IvyIcons.Help} onClick={() => window.open(url, '_blank')} />
);
