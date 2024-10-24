import { Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useParams, useSearchParams } from '@remix-run/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSortedProjects } from '~/data/project-api';
import { ArtifactTag } from './ArtifactTag';

type Group = {
  project: string;
  newArtifactCard?: ReactNode;
  children: ReactNode;
  search: string;
};

const useGroupSearchParam = () => {
  const name = 'group';
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    hasGroup: () => searchParams.get(name),
    hasGroupWithValue: (value: string) => searchParams.has(name, value),
    addGroup: (value: string) => {
      searchParams.append(name, value);
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

export const ArtifactGroup = ({ project, newArtifactCard, children, search }: Group) => {
  const { data } = useSortedProjects();
  const { hasGroup, hasGroupWithValue, addGroup, removeGroup } = useGroupSearchParam();
  const projectBean = useMemo(() => data?.find(p => p.id.pmv === project), [data, project]);
  const { ws } = useParams();
  const [open, setOpen] = useState(ws === project);
  useEffect(() => (hasGroup() === null && ws === project ? addGroup(project) : undefined), [addGroup, hasGroup, project, ws]);
  useEffect(() => setOpen(search !== '' || hasGroupWithValue(project)), [hasGroup, hasGroupWithValue, project, search, ws]);
  return (
    <Collapsible open={open} onOpenChange={e => (e ? addGroup(project) : removeGroup(project))} style={{ width: '100%', border: 0 }}>
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
        Project: {project}
        {projectBean?.id.isIar && <ArtifactTag label='Read only' />}
      </CollapsibleTrigger>
      <CollapsibleContent style={{ padding: 0 }}>
        <Flex gap={4} style={{ flexWrap: 'wrap' }}>
          {ws === project && newArtifactCard}
          {children}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
