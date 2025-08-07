import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Flex,
  IvyIcon,
  SearchInput,
  Separator,
  ToggleGroup,
  ToggleGroupItem
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortedProjects } from '~/data/project-api';
import { useSearch } from './useSearch';

export type ViewTypes = 'tile' | 'graph';

export const useOverviewFilter = <T,>(
  artifacts: Array<T>,
  filter: (t: T, search: string, projects: Array<string>, tags: Array<string>) => boolean
) => {
  const { search, setSearch, projects, setProjects, tags, setTags } = useSearch();
  const [viewType, setViewType] = useState<ViewTypes>('tile');
  const filteredAritfacts = useMemo(
    () => artifacts.filter(artifact => filter(artifact, search.toLocaleLowerCase(), projects, tags)),
    [artifacts, filter, projects, tags, search]
  );
  return { filteredAritfacts, search, setSearch, projects, setProjects, tags, setTags, viewType, setViewType };
};

type OverviewFilterProps = Omit<ReturnType<typeof useOverviewFilter>, 'filteredAritfacts'> & {
  viewTypes?: Record<Exclude<ViewTypes, 'tile'>, ReactNode>;
  children?: ReactNode;
};

export const OverviewFilter = (props: OverviewFilterProps) => {
  const { t } = useTranslation();
  const onViewTypeChange = (change: string) => {
    if (change.length !== 0) {
      props.setViewType(change as ViewTypes);
    }
  };
  return (
    <Flex direction='row' alignItems='center' gap={2} style={{ width: '100%' }}>
      <div style={{ flex: 1, height: 36 }}>
        {props.viewType === 'graph' && props.viewTypes?.graph ? (
          props.viewTypes?.graph
        ) : (
          <Flex direction='row' alignItems='center' gap={2}>
            <div style={{ flex: 1 }}>
              <SearchInput
                placeholder={t('common.label.search')}
                value={props.search}
                onChange={props.setSearch}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                autoComplete='off'
              />
            </div>
            {props.children}
          </Flex>
        )}
      </div>
      {props.viewTypes && (
        <>
          <Separator orientation='vertical' style={{ margin: 0 }} />
          <ToggleGroup type='single' value={props.viewType} onValueChange={onViewTypeChange} gap={1}>
            <ToggleGroupItem value='tile' asChild>
              <Button icon={IvyIcons.BoxView} size='large' title={t('label.tileView')} aria-label={t('label.tileView')} />
            </ToggleGroupItem>
            {props.viewTypes.graph && (
              <ToggleGroupItem value='graph' asChild>
                <Button icon={IvyIcons.GraphView} size='large' title={t('label.graphView')} aria-label={t('label.graphView')} />
              </ToggleGroupItem>
            )}
          </ToggleGroup>
        </>
      )}
    </Flex>
  );
};

type OverviewProjectFilterProps = {
  projects: Array<string>;
  setProjects: (projects: Array<string>) => void;
  allTags: Array<string>;
  tags: Array<string>;
  setTags: (tags: Array<string>) => void;
};

export const OverviewProjectFilter = ({ projects, setProjects, tags, setTags, allTags }: OverviewProjectFilterProps) => {
  const { t } = useTranslation();
  const allProjects = useSortedProjects().data?.map(p => p.id.pmv) ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Flex alignItems='center' className='overview-filter-button' style={{ position: 'relative' }}>
          <Button size='large' icon={IvyIcons.Configuration} title={t('label.filterBy')} aria-label={t('label.filterBy')} />
          <Badges count={projects.length + tags.length} />
        </Flex>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t('label.filterBy')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <IvyIcon icon={IvyIcons.Folders} />
          {t('label.project')}
        </DropdownMenuLabel>
        {allProjects.map(project => (
          <DropdownMenuCheckboxItem
            key={project}
            checked={projects.includes(project)}
            onCheckedChange={(checked: boolean) => setProjects(checked ? [...projects, project] : projects.filter(p => p !== project))}
            onSelect={e => e.preventDefault()}
          >
            {project}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <IvyIcon icon={IvyIcons.Label} />
          {t('label.tags')}
        </DropdownMenuLabel>
        {allTags.map(tag => (
          <DropdownMenuCheckboxItem
            key={tag}
            checked={tags.includes(tag)}
            onCheckedChange={(checked: boolean) => setTags(checked ? [...tags, tag] : tags.filter(t => t !== tag))}
            onSelect={e => e.preventDefault()}
          >
            {tag}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          style={{ color: 'var(--error-color)' }}
          onSelect={() => {
            setProjects([]);
            setTags([]);
          }}
        >
          <IvyIcon icon={IvyIcons.Reset} />
          <span>{t('label.resetAllFilters')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Badges = ({ count }: { count: number }) => {
  if (count === 0) {
    return null;
  }
  return (
    <Badge size='xs' round style={{ position: 'absolute', right: -3, top: -3 }} className='overview-filter-badge'>
      {count}
    </Badge>
  );
};
