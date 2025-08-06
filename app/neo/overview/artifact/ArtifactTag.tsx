import { Badge, Flex } from '@axonivy/ui-components';
import './ArtifactTag.css';

export const ArtifactTag = ({ tags }: { tags: Array<{ label: string; classname: string }> }) => {
  return (
    <Flex
      direction='row'
      justifyContent='flex-end'
      gap={1}
      style={{ position: 'absolute', top: 5, right: 5, flexWrap: 'wrap', fontSize: 10 }}
    >
      {tags.map(tag => (
        <Badge key={tag.label} size='s' variant='primary' className={'artifact-tag ' + tag.classname}>
          {tag.label}
        </Badge>
      ))}
    </Flex>
  );
};
