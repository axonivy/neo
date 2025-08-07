import { Badge, Flex } from '@axonivy/ui-components';
import type { BadgeVariants } from '@axonivy/ui-components/lib/components/common/badge/badge.css';

export const ArtifactTag = ({ tags }: { tags: Array<{ label: string; badgeVariants: BadgeVariants }> }) => {
  return (
    <Flex
      direction='row'
      justifyContent='flex-end'
      gap={1}
      style={{ position: 'absolute', top: 5, right: 5, flexWrap: 'wrap', fontSize: 10 }}
    >
      {tags.map(tag => (
        <Badge key={tag.label} size='s' variant={tag.badgeVariants?.variant} className='artifact-tag'>
          {tag.label}
        </Badge>
      ))}
    </Flex>
  );
};
