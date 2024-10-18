import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useNavigate } from '@remix-run/react';

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
    <button
      className='artifact-info-card'
      onClick={open}
      style={{
        background: 'var(--N50)',
        padding: 24,
        borderRadius: 10,
        fontSize: 14,
        flex: '1 0 300px',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer'
      }}
    >
      <Flex direction='column' gap={3}>
        <IvyIcon icon={icon} style={{ fontSize: 35, color: 'var(--P75)' }} />
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span>{description}</span>
        <Flex alignItems='center' gap={1} style={{ fontWeight: 500, alignSelf: 'flex-end', color: 'var(--P300)' }}>
          Open <IvyIcon icon={IvyIcons.Chevron} />
        </Flex>
      </Flex>
    </button>
  );
};
