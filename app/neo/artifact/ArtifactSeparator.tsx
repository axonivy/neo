import { Separator } from '@axonivy/ui-components';

export const ArtifactSeparator = ({ title }: { title: string }) => (
  <div style={{ width: '100%' }} className='artifact-separator'>
    <span style={{ fontSize: 14 }}>{title}</span>
    <Separator decorative={true} style={{ marginBlock: '10px' }} />
  </div>
);
