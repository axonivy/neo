import { Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useEffect, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useSortedProjects } from '~/data/project-api';
import { useWorkspace } from '~/data/workspace-api';
import { useSearch } from '../useSearch';
import { ArtifactTag } from './ArtifactTag';

type Group = {
  project: string;
  newArtifactCard?: ReactNode;
  children: ReactNode;
};

const useGroupSearchParam = () => {
  const name = 'group';
  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = useSearch();
  return {
    hasGroup: () => searchParams.get(name),
    isOpen: (group: string) => search !== '' || searchParams.has(name, group),
    addGroup: (group: string) => {
      searchParams.append(name, group);
      searchParams.delete(name, '');
      setSearchParams(searchParams, { replace: true });
    },
    removeGroup: (group: string) => {
      searchParams.delete(name, group);
      if (searchParams.get(name) === null) {
        searchParams.set(name, '');
      }
      setSearchParams(searchParams, { replace: true });
    }
  };
};

export const ArtifactGroup = ({ project, newArtifactCard, children }: Group) => {
  const { t } = useTranslation();
  const { data } = useSortedProjects();
  const { hasGroup, isOpen, addGroup, removeGroup } = useGroupSearchParam();
  const projectBean = useMemo(() => data?.find(p => p.id.pmv === project), [data, project]);
  const ws = useWorkspace();
  useEffect(() => (hasGroup() === null && ws?.name === project ? addGroup(project) : undefined), [addGroup, hasGroup, project, ws]);
  return (
    <Collapsible
      open={isOpen(project)}
      onOpenChange={e => (e ? addGroup(project) : removeGroup(project))}
      style={{ width: '100%', border: 0 }}
    >
      <CollapsibleTrigger
        style={{
          color: 'var(--body)',
          fontWeight: 500,
          fontSize: 14,
          borderBottom: '1px solid var(--N100)',
          padding: '10px 0px 10px 0px',
          marginBottom: 15
        }}
      >
        {t('neo.project', { proj: project })}
        {projectBean?.id.isIar && <ArtifactTag label={t('common:label.readOnly')} />}
      </CollapsibleTrigger>
      <CollapsibleContent style={{ padding: 0 }}>
        <Flex gap={4} style={{ flexWrap: 'wrap' }}>
          {ws?.name === project && newArtifactCard}
          {children}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
