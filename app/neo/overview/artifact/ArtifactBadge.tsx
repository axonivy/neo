import { Badge, Flex } from '@axonivy/ui-components';
import type { ComponentProps } from 'react';

export type Badge = { label: string; badgeStyle?: BadgeStyle };
type BadgeStyle = ComponentProps<typeof Badge>['variant'];

export const ArtifactBadge = ({ badges }: { badges: Array<Badge> }) => {
  return (
    <Flex
      direction='row'
      justifyContent='flex-end'
      gap={1}
      style={{ position: 'absolute', top: 5, right: 5, flexWrap: 'wrap', fontSize: 10 }}
    >
      {badges.map(badge => (
        <Badge key={badge.label} size='s' variant={badge.badgeStyle} className='artifact-tag'>
          {badge.label}
        </Badge>
      ))}
    </Flex>
  );
};
