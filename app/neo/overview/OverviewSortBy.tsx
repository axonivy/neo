import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Flex,
  IvyIcon
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { t } from 'i18next';
import React from 'react';

export const OverviewSortBy = ({ setSortDirection }: { setSortDirection: (direction: 'asc' | 'desc') => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Flex alignItems='center' className='overview-filter-button' style={{ position: 'relative' }}>
          <Button size='large' icon={IvyIcons.Selector} title={t('label.sortBy')} aria-label={t('label.sortBy')} />
        </Flex>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <IvyIcon icon={IvyIcons.Selector} />
          {t('label.sortBy')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem aria-label={t('label.sortByA-z')} onClick={() => setSortDirection('asc')}>
          {t('label.sortByA-z')}
        </DropdownMenuItem>
        <DropdownMenuItem aria-label={t('label.sortByZ-a')} onClick={() => setSortDirection('desc')}>
          {t('label.sortByZ-a')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const useSortedProcesses = (names: string[]) => {
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const sortedArtifacts = React.useMemo(() => {
    if (!names) return [];
    const sorted = [...names].sort((a, b) => {
      const nameA = a.toLowerCase();
      const nameB = b.toLowerCase();
      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    return sorted;
  }, [names, sortDirection]);
  return { sortedArtifacts, setSortDirection };
};
