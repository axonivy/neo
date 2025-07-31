import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import type { ViewTypes } from './OverviewFilter';

type OverviewFilterProps = {
  viewType: ViewTypes;
  projects: Array<string>;
  setProjects: (projects: Array<string>) => void;
};

export const OverviewFilterTags = ({ viewType, projects, setProjects }: OverviewFilterProps) => {
  const { t } = useTranslation();
  if (viewType !== 'tile' || projects.length === 0) {
    return null;
  }
  return (
    <Flex direction='row' alignItems='center' gap={2} className='overview-filter-tags' style={{ fontSize: 14, color: 'var(--N700)' }}>
      <span>{t('label.filterBy')}</span>
      {projects.map(project => (
        <Tag key={project} project={project} remove={() => setProjects(projects.filter(p => p !== project))} />
      ))}
    </Flex>
  );
};

const Tag = ({ project, remove }: { project: string; remove: () => void }) => {
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
      <span>{project}</span>
      <Button icon={IvyIcons.Close} size='small' onClick={remove} style={{ height: 16 }} />
    </Flex>
  );
};
