import { useParams } from '@remix-run/react';
import { ReactNode } from 'react';
import { ArtifactCollapsible } from './ArtifactCollapsible';

type Group = {
  project: string;
  newArtifactCard: ReactNode;
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
