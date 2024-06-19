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

export const NewProjectArtifactPopup = ({ defaultName, create }: Popup) => {
  const [name, setName] = useState(defaultName);
  const [namespace, setNamespace] = useState('Neo');
  const { data, isLoading } = useProjects();
  const [project, setProject] = useState<ProjectIdentifier>();
  const projects = data ?? [];
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
          <Fieldset>
            <BasicSelect
              placeholder={isLoading && <Spinner size='small' />}
              items={projects.map(p => ({
                value: JSON.stringify(p),
                label: `${p.app}/${p.pmv}`
              }))}
              onValueChange={value => setProject(JSON.parse(value))}
            />
          </Fieldset>
          <Button icon={IvyIcons.Plus} variant='primary' onClick={() => create(name, namespace, project)}>
            Create
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
