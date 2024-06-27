import { Fieldset, Spinner, BasicSelect } from '@axonivy/ui-components';
import { useEffect } from 'react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';

type ProjectSelectProps = {
  project: ProjectIdentifier | undefined;
  setProject: (project: ProjectIdentifier) => void;
};

export const ProjectSelect = ({ project, setProject }: ProjectSelectProps) => {
  const { data, isPending } = useProjects();
  const projects = data ?? [];
  useEffect(() => {
    project ?? setProject(projects[0]);
  });
  return (
    <Fieldset label='Project'>
      {isPending ? (
        <Spinner size='small' />
      ) : (
        <BasicSelect
          placeholder={isPending && <Spinner size='small' />}
          items={projects.map(p => ({
            value: JSON.stringify(p),
            label: `${p.app}/${p.pmv}`
          }))}
          defaultValue={JSON.stringify(projects[0])}
          onValueChange={value => setProject(JSON.parse(value))}
        />
      )}
    </Fieldset>
  );
};
