import { Flex } from '@axonivy/ui-components';

export const ArtifactTag = ({ tags }: { tags: Array<string> }) => (
  <Flex
    direction='row'
    justifyContent='flex-end'
    gap={1}
    style={{ position: 'absolute', top: 5, right: 5, flexWrap: 'wrap', fontSize: 10 }}
  >
    {tags.map(tag => (
      <div
        key={tag}
        className='artifact-tag'
        style={{ background: 'var(--P50)', padding: 'var(--size-1)', borderRadius: 'var(--border-r2)' }}
      >
        <span style={{ color: 'var(--P300)' }}>{tag}</span>
      </div>
    ))}
  </Flex>
);
