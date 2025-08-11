import { Badge, Button, Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { ViewTypes } from './OverviewFilter';

type OverviewFilterProps = {
  viewType: ViewTypes;
  projects: Array<string>;
  setProjects: (projects: Array<string>) => void;
  tags: Array<string>;
  setTags: (tags: Array<string>) => void;
};

export const OverviewFilterTags = ({ viewType, projects, setProjects, tags, setTags }: OverviewFilterProps) => {
  const { t } = useTranslation();
  if (viewType !== 'tile' || (projects.length === 0 && tags.length === 0)) {
    return null;
  }
  return (
    <Flex direction='row' alignItems='center' gap={2} className='overview-filter-tags' style={{ fontSize: 14, color: 'var(--N700)' }}>
      <span>{t('label.filterBy')}</span>
      {projects.map(project => (
        <Tag
          key={project}
          name={
            <Badge variant='outline'>
              <IvyIcon icon={IvyIcons.Folders} /> {project}
            </Badge>
          }
          remove={() => setProjects(projects.filter(p => p !== project))}
        />
      ))}
      {tags.map(tag => (
        <Tag
          key={tag}
          name={
            <Badge variant='outline'>
              <IvyIcon icon={IvyIcons.Label} /> {tag}
            </Badge>
          }
          remove={() => setTags(tags.filter(t => t !== tag))}
        />
      ))}
    </Flex>
  );
};

const Tag = ({ name, remove }: { name: React.ReactNode; remove: () => void }) => {
  return (
    <Flex
      alignItems='center'
      gap={1}
      className='overview-filter-tag'
      style={{
        color: 'var(--N900)',
        background: 'var(--N50)',
        fontSize: 12,
        borderRadius: '1rem',
        padding: 'var(--size-1) var(--size-2)',
        border: '1px solid var(--N100)'
      }}
    >
      {name}
      <Button icon={IvyIcons.Close} size='small' onClick={remove} style={{ height: 16 }} />
    </Flex>
  );
};
