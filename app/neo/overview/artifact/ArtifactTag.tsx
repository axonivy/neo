import { Badge, Flex } from '@axonivy/ui-components';

export type Tag = { label: string; tagStyle?: TagStyle };
type TagStyle = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline';

export const ArtifactTag = ({ tags }: { tags: Array<Tag> }) => {
  return (
    <Flex
      direction='row'
      justifyContent='flex-end'
      gap={1}
      style={{ position: 'absolute', top: 5, right: 5, flexWrap: 'wrap', fontSize: 10 }}
    >
      {tags.map(tag => (
        <Badge key={tag.label} size='s' variant={tag.tagStyle} className='artifact-tag'>
          {tag.label}
        </Badge>
      ))}
    </Flex>
  );
};
