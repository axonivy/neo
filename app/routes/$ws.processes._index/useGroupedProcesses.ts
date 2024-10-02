import { useMemo } from 'react';
import { ProcessBean } from '~/data/generated/openapi-dev';
import { groupArtifacts } from '~/neo/artifact/group-artifacts';

export const useGroupedProcesses = (processes: ProcessBean[]) => {
  return useMemo(() => groupArtifacts(processes, p => p.processIdentifier.project.pmv), [processes]);
};
