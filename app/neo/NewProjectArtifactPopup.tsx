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
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { EditorType } from './useEditors';
import { useCreateForm } from '~/data/form-api';

type Popup = { editorType: EditorType; defaultName: string };

export const NewProjectArtifactPopup = ({ editorType, defaultName }: Popup) => {
  const [name, setName] = useState(defaultName);
  const [namespace, setNamespace] = useState('Neo');
  const { data, isLoading } = useProjects();
  const { createProcess } = useCreateProcess();
  const { createForm } = useCreateForm();
  const create = () => {
    if (editorType === 'forms') return createForm({ name, namespace, type: 'Form', project });
    return createProcess({ name, namespace, kind: 'Business Process', project });
  };
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
          <Button icon={IvyIcons.Plus} variant='primary' onClick={() => create()}>
            Create
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
