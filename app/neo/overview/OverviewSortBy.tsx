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
import React, { useMemo, useState } from 'react';

export const OverviewSortBy = ({ setSortDirection }: { setSortDirection: (direction: 'asc' | 'desc' | undefined) => void }) => {
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
        <DropdownMenuItem aria-label={t('common.label.default')} onClick={() => setSortDirection(undefined)}>
          <IvyIcon icon={IvyIcons.Chevron} rotate={90} /> {t('common.label.default')}
        </DropdownMenuItem>
        <DropdownMenuItem aria-label={t('label.sortByA-z')} onClick={() => setSortDirection('asc')}>
          <IvyIcon icon={IvyIcons.ArrowRight} rotate={90} /> {t('label.sortByA-z')}
        </DropdownMenuItem>
        <DropdownMenuItem aria-label={t('label.sortByZ-a')} onClick={() => setSortDirection('desc')}>
          <IvyIcon icon={IvyIcons.ArrowRight} rotate={270} /> {t('label.sortByZ-a')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function useSortedArtifacts<T>(
  artifacts: T[],
  nameExtractor: (artifact: T) => string
): { sortedArtifacts: T[]; setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc' | undefined>> } {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(undefined);

  const sortedArtifacts = useMemo(() => {
    if (!sortDirection) {
      return artifacts;
    }
    const sorted = [...artifacts].sort((a, b) => {
      const nameA = nameExtractor(a);
      const nameB = nameExtractor(b);

      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return sorted;
  }, [artifacts, sortDirection, nameExtractor]);

  return { sortedArtifacts, setSortDirection };
}
