import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import './ArifactInfoCard.css';

type ArtifactInfoCardProps = {
  title: string;
  description: string;
  icon: IvyIcons;
  link: string;
};

export const ArtifactInfoCard = ({ title, description, icon, link }: ArtifactInfoCardProps) => {
  const naviagte = useNavigate();
  const open = () => naviagte(link);
  const { t } = useTranslation();
  return (
    <button className='artifact-info-card' onClick={open}>
      <Flex direction='column' gap={3}>
        <IvyIcon icon={icon} className='artifact-icon' />
        <span className='artifact-title'>{title}</span>
        <span>{description}</span>
        <Flex alignItems='center' gap={1} className='artifact-footer'>
          {t('common:label.open')} <IvyIcon icon={IvyIcons.Chevron} />
        </Flex>
      </Flex>
    </button>
  );
};
