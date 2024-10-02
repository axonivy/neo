import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useForms } from '~/data/form-api';
import { groupArtifacts, groupSort, insertWorkspaceIfAbsent } from '~/neo/artifact/group-artifacts';

export const useGroupedForms = () => {
  const { ws } = useParams();
  const { data, isPending } = useForms();
  const [search, setSearch] = useState('');
  const groupedForms = useMemo(() => {
    const forms = data?.filter(form => form.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
    const grouped = groupArtifacts(forms, f => f.identifier.project.pmv);
    insertWorkspaceIfAbsent(grouped, ws);
    return Object.entries(grouped).sort((a, b) => groupSort(a[0], b[0], ws));
  }, [data, search, ws]);
  return { search, setSearch, isPending, groupedForms };
};
