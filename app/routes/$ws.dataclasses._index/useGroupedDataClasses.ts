import { groupBy } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useDataClasses } from '~/data/data-class-api';
import { insertWorkspaceIfAbsent, projectSort } from '~/neo/artifact/list-artifacts';

export const useGroupedDataClasses = () => {
  const { ws } = useParams();
  const { data, isPending } = useDataClasses();
  const [search, setSearch] = useState('');
  const groupedDataClasses = useMemo(() => {
    const dataClasses = data?.filter(dc => dc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
    const grouped = groupBy(dataClasses, d => d.dataClassIdentifier.project.pmv);
    insertWorkspaceIfAbsent(grouped, ws);
    return Object.entries(grouped).sort((a, b) => projectSort(a[0], b[0], ws));
  }, [data, search, ws]);
  return { search, setSearch, isPending, groupedDataClasses };
};
