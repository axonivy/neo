import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useDataClasses } from '~/data/data-class-api';
import { groupArtifacts, groupSort } from '~/neo/artifact/group-artifacts';

export const useGroupedDataClasses = () => {
  const { ws } = useParams();
  const { data, isPending } = useDataClasses();
  const [search, setSearch] = useState('');
  const groupedDataClasses = useMemo(() => {
    const dataClasses = data?.filter(dc => dc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
    const grouped = groupArtifacts(dataClasses, d => d.dataClassIdentifier.project.pmv);
    const baseProject = ws ?? '';
    if (grouped[baseProject] === undefined) {
      grouped[baseProject] = [];
    }
    return Object.entries(grouped).sort((a, b) => groupSort(a[0], b[0], baseProject));
  }, [data, search, ws]);
  return { search, setSearch, isPending, groupedDataClasses };
};
