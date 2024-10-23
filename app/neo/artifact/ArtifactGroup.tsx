import { Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useMemo, type ReactNode } from 'react';
import { useSortedProjects } from '~/data/project-api';
import { ArtifactTag } from './ArtifactTag';

type Group = {
  project: string;
  newArtifactCard?: ReactNode;
  children: ReactNode;
};

export const ArtifactGroup = ({ project, newArtifactCard, children }: Group) => {
  const { data } = useSortedProjects();
  const projectBean = useMemo(() => data?.find(p => p.id.pmv === project), [data, project]);
  const { ws } = useParams();
  return (
    <Collapsible defaultOpen={true} style={{ width: '100%', border: 0 }}>
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
