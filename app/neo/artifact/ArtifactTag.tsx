export const ArtifactTag = ({ label }: { label: string }) => (
  <div className='artifact-tag' style={{ background: 'var(--P50)', padding: 'var(--size-1)', borderRadius: 'var(--border-r2)' }}>
    <span style={{ fontWeight: 500, color: 'var(--P300)' }}>{label}</span>
  </div>
);
