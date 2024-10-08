import { Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { ReactNode } from 'react';

type Group = {
  project: string;
  newArtifactCard?: ReactNode;
  children: ReactNode;
};

export const ArtifactGroup = ({ project, newArtifactCard, children }: Group) => {
  const { ws } = useParams();
  return (
    <>
      {ws === project ? (
        <>
          {newArtifactCard}
          {children}
        </>
      ) : (
        <ArtifactCollapsible title={project}>{children}</ArtifactCollapsible>
      )}
    </>
  );
};

const ArtifactCollapsible = ({ title, children }: { title: string; children: ReactNode }) => (
  <Collapsible defaultOpen={true} style={{ width: '100%' }}>
    <CollapsibleTrigger style={{ color: 'var(--body)', fontWeight: 400, fontSize: 14 }}>{title}</CollapsibleTrigger>
    <CollapsibleContent>
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {children}
      </Flex>
    </CollapsibleContent>
  </Collapsible>
);
