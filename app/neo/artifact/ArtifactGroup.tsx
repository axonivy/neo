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
        <Collapsible defaultOpen={true} style={{ width: '100%', border: 0 }}>
          <CollapsibleTrigger
            style={{
              color: 'var(--body)',
              fontWeight: 400,
              fontSize: 14,
              borderBottom: '1px solid var(--N100)',
              padding: '10px 0px 10px 0px',
              marginBottom: 25
            }}
          >
            {project}
          </CollapsibleTrigger>
          <CollapsibleContent style={{ padding: 0 }}>
            <Flex gap={4} style={{ flexWrap: 'wrap' }}>
              {children}
            </Flex>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
};
