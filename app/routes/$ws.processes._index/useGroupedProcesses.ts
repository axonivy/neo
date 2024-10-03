import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useProcesses } from '~/data/process-api';
import { groupArtifacts, groupSort, insertWorkspaceIfAbsent } from '~/neo/artifact/group-artifacts';

export const useGroupedProcesses = () => {
  const { ws } = useParams();
  const { data, isPending } = useProcesses();
  const [search, setSearch] = useState('');
  const groupedProcesses = useMemo(() => {
    const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
    const grouped = groupArtifacts(processes, p => p.processIdentifier.project.pmv);
    insertWorkspaceIfAbsent(grouped, ws);
    return Object.entries(grouped).sort((a, b) => groupSort(a[0], b[0], ws));
  }, [data, search, ws]);
  return { search, setSearch, isPending, groupedProcesses };
};
