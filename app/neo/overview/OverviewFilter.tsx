import { Button, Flex, SearchInput, ToggleGroup, ToggleGroupItem } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from './useSearch';

export type ViewTypes = 'tile' | 'graph';

export const useOverviewFilter = () => {
  const search = useSearch();
  const [viewType, setViewType] = useState<ViewTypes>('tile');
  return { ...search, viewType, setViewType };
};

type OverviewFilterProps = ReturnType<typeof useOverviewFilter> & {
  viewTypes?: Record<Exclude<ViewTypes, 'tile'>, ReactNode>;
};

export const OverviewFilter = ({ search, setSearch, viewType, setViewType, viewTypes }: OverviewFilterProps) => {
  const { t } = useTranslation();
  const onViewTypeChange = (change: string) => {
    if (change.length !== 0) {
      setViewType(change as ViewTypes);
    }
  };
  return (
    <Flex direction='row' alignItems='center' justifyContent='flex-end' gap={4} style={{ width: '100%' }}>
      <div style={{ width: '100%', height: '34px' }}>
        {viewType === 'graph' && viewTypes?.graph ? (
          viewTypes?.graph
        ) : (
          // eslint-disable-next-line jsx-a11y/no-autofocus
          <SearchInput placeholder={t('common.label.search')} value={search} onChange={setSearch} autoFocus={true} />
        )}
      </div>
      {viewTypes && (
        <ToggleGroup type='single' value={viewType} onValueChange={onViewTypeChange} gap={1}>
          <ToggleGroupItem value='tile' asChild>
            <Button icon={IvyIcons.BoxView} size='large' title={t('label.tileView')} aria-label={t('label.tileView')} />
          </ToggleGroupItem>
          {viewTypes.graph && (
            <ToggleGroupItem value='graph' asChild>
              <Button icon={IvyIcons.GraphView} size='large' title={t('label.graphView')} aria-label={t('label.graphView')} />
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      )}
    </Flex>
  );
};
