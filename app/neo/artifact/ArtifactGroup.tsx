import { Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { type ReactNode } from 'react';

type Group = {
  project: string;
  newArtifactCard?: ReactNode;
  children: ReactNode;
};

export const ArtifactGroup = ({ project, newArtifactCard, children }: Group) => {
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
        {project}
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
