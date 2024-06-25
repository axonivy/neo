import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  Flex,
  PopoverArrow,
  Input,
  Fieldset,
  BasicSelect,
  Spinner
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';

type Popup = {
  defaultName: string;
  create: (name: string, namespace: string, project?: ProjectIdentifier) => string | number;
};

const ProjectSelect = ({
  project,
  setProject
}: {
  project: ProjectIdentifier | undefined;
  setProject: (project: ProjectIdentifier) => void;
}) => {
  const { data, isPending } = useProjects();
  const projects = data ?? [];
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
          defaultValue={(() => {
            project ?? setProject(projects[0]);
            return JSON.stringify(projects[0]);
          })()}
          onValueChange={value => setProject(JSON.parse(value))}
        />
      )}
    </Fieldset>
  );
};

export const NewProjectArtifactPopup = ({ defaultName, create }: Popup) => {
  const [name, setName] = useState(defaultName);
  const [namespace, setNamespace] = useState('Neo');
  const [project, setProject] = useState<ProjectIdentifier>();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button icon={IvyIcons.Plus} size='large' />
      </PopoverTrigger>
      <PopoverContent sideOffset={0} collisionPadding={20} side='bottom' style={{ border: 'var(--basic-border)' }}>
        <PopoverArrow />
        <Flex direction='column' gap={1}>
          <Fieldset label='Name'>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </Fieldset>
          <Fieldset label='Namespace'>
            <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
          </Fieldset>
          <ProjectSelect project={project} setProject={setProject} />
          <Button icon={IvyIcons.Plus} variant='primary' onClick={() => create(name, namespace, project)}>
            Create
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
