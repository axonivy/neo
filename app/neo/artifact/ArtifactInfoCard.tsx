import { Flex, IvyIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useNavigate } from 'react-router';
import './ArtifactInfoCard.css';

type ArtifactInfoCardProps = {
  title: string;
  description: string;
  icon: IvyIcons;
  link: string;
};

export const ArtifactInfoCard = ({ title, description, icon, link }: ArtifactInfoCardProps) => {
  const naviagte = useNavigate();
  const open = () => naviagte(link);
  return (
    <button className='artifact-info-card' onClick={open}>
      <Flex alignItems='center' direction='column' gap={1} className='artifact-info-center'>
        <Flex className='artifact-info-icon'>
          <TooltipProvider>
            <Tooltip delayDuration={400}>
              <TooltipTrigger asChild>
                <IvyIcon icon={IvyIcons.InfoCircle} />
              </TooltipTrigger>
              <TooltipContent style={{ width: '30em' }}>
                <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--N900)' }}>{description}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Flex>
        <IvyIcon icon={icon} className='artifact-icon' />
        <span className='artifact-title'>{title}</span>
      </Flex>
    </button>
  );
};
