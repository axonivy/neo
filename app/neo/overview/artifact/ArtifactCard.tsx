import { Flex, IvyIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import './ArtifactCard.css';
import { ArtifactTag } from './ArtifactTag';

type Card = {
  name: string;
  onClick: () => void;
  preview: ReactNode;
  tooltip?: string;
  tagLabel?: string;
} & React.ComponentProps<'div'>;

export const ArtifactCard = ({ name, preview, onClick, tooltip, tagLabel, ref, children }: Card) => (
  <div className='artifact-card' ref={ref}>
    <TooltipProvider>
      <Tooltip delayDuration={700}>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
        <TooltipTrigger asChild>
          <button className='card normal-card' onClick={onClick}>
            <Flex direction='column' justifyContent='space-between' gap={2} className='card-content'>
              <Flex alignItems='center' justifyContent='center' className='card-preview'>
                {tagLabel && (
                  <div style={{ position: 'absolute', top: 15, right: 15 }}>
                    <ArtifactTag label={tagLabel} />
                  </div>
                )}
                {preview}
              </Flex>
              <Flex alignItems='center' justifyContent='space-between' gap={1}>
                <span className='card-name'>{name}</span>
              </Flex>
            </Flex>
          </button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
    <div className='card-menu-trigger'>{children ?? <IvyIcon icon={IvyIcons.ArrowRight} />}</div>
  </div>
);
