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
import { useCreateProcess } from '~/data/process-api';
import { useProjects } from '~/data/project-api';

export const NewProcessPopup = () => {
  const [name, setName] = useState('MyNewProcess');
  const [namespace, setNamespace] = useState('Neo');
  const [path, setPath] = useState('/Users/lli/GitWorkspace/market/demo-projects/workflow/workflow-demos');
  const { createProcess } = useCreateProcess();
  const { data, isLoading } = useProjects();
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
          <Fieldset label='Absolute PMV Path'>
            <Input value={path} onChange={e => setPath(e.target.value)} />
          </Fieldset>
          <Fieldset>
            <BasicSelect
              placeholder={isLoading && <Spinner size='small' />}
              items={projectIds.map(id => ({
                value: JSON.stringify(id),
                label: `${id.app}/${id.pmv}`
              }))}
            />
          </Fieldset>
          <Button
            icon={IvyIcons.Plus}
            variant='primary'
            onClick={() =>
              createProcess({
                name,
                namespace,
                path,
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
