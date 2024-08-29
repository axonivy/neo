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
  PasswordInput,
  toast
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ReactNode, useState } from 'react';
import { DeployParams } from '~/data/workspace-api';

export type DeployActionParams = Omit<DeployParams, 'workspaceId'>;

export const DeployDialog = ({
  children,
  deployAction
}: {
  children: ReactNode;
  deployAction: (params: DeployActionParams) => Promise<string>;
}) => {
  const [engineUrl, setEngineUrl] = useState(window.location.origin);
  const [appName, setAppName] = useState('myApp');
  const [user, setUser] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [log, setLog] = useState<string>();
  if (log) {
    return DeployLogDialog({ children, log });
  }
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
          <Button
            variant='primary'
            size='large'
            onClick={() => deployAction({ applicationName: appName, engineUrl, user, password }).then(deployLog => setLog(deployLog))}
            icon={IvyIcons.Bpmn}
          >
            Deploy
          </Button>
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

const DeployLogDialog = ({ children, log }: { children: ReactNode; log: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent style={{ overflow: 'auto', maxHeight: '80%', maxWidth: '80%' }}>
        <DialogHeader>
          <DialogTitle>Deployment Log</DialogTitle>
          <DialogDescription>Returned log output from the engine.</DialogDescription>
        </DialogHeader>
        <pre style={{ overflow: 'auto' }}>
          <code>{log}</code>
        </pre>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='primary' size='large' icon={IvyIcons.Close}>
              Close
            </Button>
          </DialogClose>
          <Button
            variant='outline'
            size='large'
            icon={IvyIcons.Note}
            onClick={() => navigator.clipboard.writeText(log).then(() => toast.success('Log copied to the clipboard'))}
          >
            Copy Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
