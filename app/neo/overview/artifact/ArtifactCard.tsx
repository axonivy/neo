import { cn, Flex, IvyIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import { ArtifactBadge, type Badge } from './ArtifactBadge';
import './ArtifactCard.css';

type Card = {
  name: string;
  onClick: () => void;
  preview: ReactNode;
  description?: string;
  tooltip?: string;
  badges?: Array<Badge>;
} & React.ComponentProps<'div'>;

export const ArtifactCard = ({ name, description, preview, onClick, tooltip, badges, ref, className, children }: Card) => (
  <div className={cn('artifact-card', className)} ref={ref}>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Flex direction='column' gap={1} className='card-content'>
            <button className='card' onClick={onClick}>
              {badges && <ArtifactBadge badges={badges} />}
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
