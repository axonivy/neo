import { BasicField, BasicSelect, Spinner } from '@axonivy/ui-components';
import { useEffect, useMemo } from 'react';
import { type ProjectIdentifier, useSortedProjects } from '~/data/project-api';

type ProjectSelectProps = {
  setProject: (project?: ProjectIdentifier) => void;
  setDefaultValue: boolean;
  label: string;
};

export const ProjectSelect = ({ setProject, setDefaultValue, label }: ProjectSelectProps) => {
  const { data, isPending } = useSortedProjects();
  const projects = useMemo(() => data?.filter(p => !p.id.isIar).map(p => p.id) ?? [], [data]);
  useEffect(() => setProject(setDefaultValue ? projects[0] : undefined), [projects, setDefaultValue, setProject]);
  return (
    <BasicField label={label}>
      {isPending ? (
        <Spinner size='small' />
      ) : (
        <BasicSelect
          placeholder={isPending && <Spinner size='small' />}
          items={projects.map(p => ({
            value: JSON.stringify(p),
            label: p.pmv
          }))}
          defaultValue={setDefaultValue ? JSON.stringify(projects[0]) : undefined}
          onValueChange={value => setProject(JSON.parse(value))}
        />
      )}
    </BasicField>
  );
};
