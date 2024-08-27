import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Fieldset,
  Flex,
  Input,
  PasswordInput
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ReactNode, useState } from 'react';
import { DeployParams } from '~/data/workspace-api';

export type DeployActionParams = Omit<DeployParams, 'workspaceId'>;

export const DeployDialog = ({ children, deployAction }: { children: ReactNode; deployAction: (params: DeployActionParams) => void }) => {
  const [engineUrl, setEngineUrl] = useState(window.location.origin);
  const [appName, setAppName] = useState('myApp');
  const [user, setUser] = useState('admin');
  const [password, setPassword] = useState('admin');
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deploy Workspace</DialogTitle>
          <DialogDescription>Specify the engine to which you want to deploy the current workspace.</DialogDescription>
        </DialogHeader>
        <Flex direction='column' gap={2}>
          <Fieldset label='Engine Url'>
            <Input value={engineUrl} onChange={e => setEngineUrl(e.target.value)} />
          </Fieldset>
          <Fieldset label='Application Name'>
            <Input value={appName} onChange={e => setAppName(e.target.value)} />
          </Fieldset>
          <Fieldset label='User'>
            <Input value={user} onChange={e => setUser(e.target.value)} />
          </Fieldset>
          <Fieldset label='Password'>
            <PasswordInput value={password} onChange={pw => setPassword(pw)} />
          </Fieldset>
        </Flex>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='primary'
              size='large'
              onClick={() => deployAction({ applicationName: appName, engineUrl, user, password })}
              icon={IvyIcons.Bpmn}
            >
              Deploy
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant='outline' size='large' icon={IvyIcons.Close}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
