import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavLink } from '@remix-run/react';

type ArtifactInfoCardProps = {
  title: string;
  description: string;
  icon: IvyIcons;
  link: string;
};

export const ArtifactInfoCard = ({ title, description, icon, link }: ArtifactInfoCardProps) => (
  <div className='artifact-info-card' style={{ background: 'var(--N50)', padding: 24, borderRadius: 10, fontSize: 14, flex: '1 0 300px' }}>
    <Flex direction='column' gap={3}>
      <IvyIcon icon={icon} style={{ fontSize: 35, color: 'var(--P75)' }} />
      <span style={{ fontWeight: 600 }}>{title}</span>
      <span>{description}</span>
      <NavLink
        to={link}
        prefetch='intent'
        style={{ alignSelf: 'flex-end', color: 'var(--P300)', textDecoration: 'none' }}
        aria-label={title}
        title={title}
      >
        <Flex alignItems='center' gap={1}>
          Open <IvyIcon icon={IvyIcons.Chevron} />
        </Flex>
      </NavLink>
    </Flex>
  </div>
);
