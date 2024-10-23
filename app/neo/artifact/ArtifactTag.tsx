export const ArtifactTag = ({ label }: { label: string }) => (
  <div className='artifact-tag' style={{ background: 'var(--P50)', color: 'red', padding: 5, borderRadius: 5 }}>
    <span style={{ fontWeight: 500, color: 'var(--P300)' }}>{label}</span>
  </div>
);
