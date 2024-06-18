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
import { ProcessIdentifier, useCreateProcess } from '~/data/process-api';
import { useProjects } from '~/data/project-api';

export const NewProcessPopup = () => {
  const [name, setName] = useState('MyNewProcess');
  const [namespace, setNamespace] = useState('Neo');
  const { createProcess } = useCreateProcess();
  const { data, isLoading } = useProjects();
  const [project, setProject] = useState<ProcessIdentifier>();
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
          <Button
            icon={IvyIcons.Plus}
            variant='primary'
            onClick={() =>
              createProcess({
                name,
                namespace,
                project,
                kind: 'Business Process'
              })
            }
          >
            Create
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
