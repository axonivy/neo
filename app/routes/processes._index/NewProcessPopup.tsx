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
  const [projectIdentifier, setProjectIdentifier] = useState<ProcessIdentifier>();
  const projectIds = data ?? [];
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
              items={projectIds.map(id => ({
                value: JSON.stringify(id),
                label: `${id.app}/${id.pmv}`
              }))}
              onValueChange={value => setProjectIdentifier(JSON.parse(value))}
            />
          </Fieldset>
          <Button
            icon={IvyIcons.Plus}
            variant='primary'
            onClick={() =>
              createProcess({
                name,
                namespace,
                projectIdentifier,
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
