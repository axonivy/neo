import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { ProcessBean } from '~/data/generated/openapi-dev';
import { useProcesses } from '~/data/process-api';
import { groupArtifacts } from '~/neo/artifact/group-artifacts';

export const useGroupedProcesses = () => {
  const { ws } = useParams();
  const { data, isPending } = useProcesses();
  const [search, setSearch] = useState('');
  const groupedProcesses = useMemo(() => {
    const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
    const grouped = groupArtifacts(processes, p => p.processIdentifier.project.pmv);
    const baseProject = ws ?? '';
    if (grouped[baseProject] === undefined) {
      grouped[baseProject] = [];
    }
    return Object.entries(grouped).sort((a, b) => groupSort(a, b, baseProject));
  }, [data, search, ws]);
  return { search, setSearch, isPending, groupedProcesses };
};

const groupSort = (a: [string, ProcessBean[]], b: [string, ProcessBean[]], baseProject: string) => {
  if (a[0] === baseProject) return -1;
  if (b[0] === baseProject) return 1;
  return a[0].localeCompare(b[0]);
};
