/* eslint-disable jsx-a11y/no-autofocus */
import { Button, Flex, SearchInput, Spinner, ToggleGroup, ToggleGroupItem } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoPopover } from './InfoPopover';

type OverviewProps = {
  title?: string;
  description?: string;
  search: string;
  onSearchChange: (search: string) => void;
  graph?: {
    graph: ReactNode;
    filter?: ReactNode;
  };
  isPending: boolean;
  children: ReactNode;
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
      {title && <span style={{ fontWeight: 600 }}>{title}</span>}
      {description && (
        <Flex direction='row' gap={1}>
          <span style={{ fontWeight: 400, color: 'var(--N900)' }}>{description}</span>
          {info && <InfoPopover info={info} />}
          {helpUrl && <HelpButton url={helpUrl} />}
        </Flex>
      )}

      <Flex direction='row' alignItems='center' justifyContent='flex-end' gap={4} style={{ width: '100%' }}>
        <div style={{ width: '100%', height: '34px' }}>
          {!showGraph || graph === undefined ? (
            <SearchInput placeholder={t('common.label.search')} value={search} onChange={onSearchChange} autoFocus={true} />
          ) : (
            graph.filter
          )}
        </div>
        {graph && (
          <ToggleGroup
            type='single'
            defaultValue={showGraph ? 'graph' : 'tile'}
            value={showGraph ? 'graph' : 'tile'}
            onValueChange={change => setShowGraph(change === 'graph' ? true : false)}
            gap={1}
          >
            <ToggleGroupItem value='tile' asChild>
              <Button icon={IvyIcons.GridDots} size='large' title={t('label.tileView')} aria-label={t('label.tileView')} />
            </ToggleGroupItem>
            <ToggleGroupItem value='graph' asChild>
              <Button icon={IvyIcons.Process} rotate={90} size='large' title={t('label.graphView')} aria-label={t('label.graphView')} />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </Flex>
      {graph && showGraph ? (
        graph.graph
      ) : (
        <Flex gap={4} style={{ flexWrap: 'wrap' }}>
          {isPending ? <Spinner size='small' className='overview-loader' /> : <>{children}</>}
        </Flex>
      )}
    </Flex>
  );
};

const HelpButton = ({ url }: { url: string }) => (
  <Button size='small' style={{ color: 'var(--P300)' }} icon={IvyIcons.Help} onClick={() => window.open(url, '_blank')} />
);
