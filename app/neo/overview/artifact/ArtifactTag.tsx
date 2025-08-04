import { Badge, Flex } from '@axonivy/ui-components';

export const ArtifactTag = ({ tags }: { tags: Array<string> }) => (
  <Flex
    direction='row'
    justifyContent='flex-end'
    gap={1}
    style={{ position: 'absolute', top: 5, right: 5, flexWrap: 'wrap', fontSize: 10 }}
  >
    {tags.map(tag => (
      <Badge key={tag} size='s' variant='primary' className='artifact-tag'>
        {tag}
      </Badge>
    ))}
  </Flex>
);
