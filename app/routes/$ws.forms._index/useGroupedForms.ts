import { groupBy } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useForms } from '~/data/form-api';
import { insertWorkspaceIfAbsent, projectSort } from '~/neo/artifact/list-artifacts';

export const useGroupedForms = () => {
  const { ws } = useParams();
  const { data, isPending } = useForms();
  const [search, setSearch] = useState('');
  const groupedForms = useMemo(() => {
    const forms = data?.filter(form => form.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
    const grouped = groupBy(forms, f => f.identifier.project.pmv);
    insertWorkspaceIfAbsent(grouped, ws);
    return Object.entries(grouped).sort((a, b) => projectSort(a[0], b[0], ws));
  }, [data, search, ws]);
  return { search, setSearch, isPending, groupedForms };
};
