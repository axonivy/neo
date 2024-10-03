import { groupBy } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useProcesses } from '~/data/process-api';
import { insertWorkspaceIfAbsent, projectSort } from '~/neo/artifact/list-artifacts';

export const useGroupedProcesses = () => {
  const { ws } = useParams();
  const { data, isPending } = useProcesses();
  const [search, setSearch] = useState('');
  const groupedProcesses = useMemo(() => {
    const processes = data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
    const grouped = groupBy(processes, p => p.processIdentifier.project.pmv);
    insertWorkspaceIfAbsent(grouped, ws);
    return Object.entries(grouped).sort((a, b) => projectSort(a[0], b[0], ws));
  }, [data, search, ws]);
  return { search, setSearch, isPending, groupedProcesses };
};
