import { Flex, IvyIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavLink } from 'react-router';
import './OverviewInfoCard.css';

type OverviewInfoCardProps = {
  title: string;
  description: string;
  icon: IvyIcons;
  link: string;
};

export const OverviewInfoCard = ({ title, description, icon, link }: OverviewInfoCardProps) => (
  <NavLink to={link} relative='route' className='overview-info-card'>
    <Flex alignItems='center' direction='column' gap={1}>
      <Flex className='overview-info-help-icon'>
        <TooltipProvider>
          <Tooltip delayDuration={400}>
            <TooltipTrigger asChild>
              <IvyIcon icon={IvyIcons.InfoCircle} />
            </TooltipTrigger>
            <TooltipContent style={{ width: '30em', padding: 15 }}>{description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Flex>
      <IvyIcon icon={icon} className='overview-info-icon' />
      <span>{title}</span>
    </Flex>
  </NavLink>
);
