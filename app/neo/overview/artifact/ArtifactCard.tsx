import { Flex, IvyIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import './ArtifactCard.css';
import { ArtifactTag } from './ArtifactTag';

type Card = {
  name: string;
  onClick: () => void;
  preview: ReactNode;
  description?: string;
  tooltip?: string;
  tagLabel?: string;
} & React.ComponentProps<'div'>;

export const ArtifactCard = ({ name, description, preview, onClick, tooltip, tagLabel, ref, children }: Card) => (
  <div className='artifact-card' ref={ref}>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Flex direction='column' gap={1} className='card-content'>
            <button className='card' onClick={onClick}>
              {tagLabel && (
                <div style={{ position: 'absolute', top: 5, right: 5 }}>
                  <ArtifactTag label={tagLabel} />
                </div>
              )}
              {preview}
            </button>
            <Flex direction='row' gap={2} justifyContent='space-between'>
              <Flex direction='column' gap={1} className='card-name'>
                <span>{name}</span>
                {description && <span className='card-description'>{description}</span>}
              </Flex>
              {children ?? <IvyIcon icon={IvyIcons.ArrowRight} />}
            </Flex>
          </Flex>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent side='bottom' align='start'>
            {tooltip}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  </div>
);
