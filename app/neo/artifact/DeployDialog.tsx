import {
  BasicField,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  Input,
  PasswordInput,
  Spinner,
  toast
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode, useState } from 'react';
import type { DeployParams } from '~/data/workspace-api';

export type DeployActionParams = Omit<DeployParams, 'workspaceId'>;

type DeployDialogProps = { children: ReactNode; deployAction: (params: DeployActionParams) => Promise<string> };

export const DeployDialog = ({ children, deployAction }: DeployDialogProps) => {
  const [engineUrl, setEngineUrl] = useState(window.location.origin);
  const [appName, setAppName] = useState('myApp');
  const [user, setUser] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [log, setLog] = useState<string>();
  const [deploying, setDeploying] = useState(false);
  const deploy = () => {
    setDeploying(true);
    deployAction({ applicationName: appName, engineUrl, user, password })
      .then(setLog)
      .finally(() => setDeploying(false));
  };
  return (
    <Dialog onOpenChange={() => setLog(undefined)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {log ? (
        DeployLogContent(log)
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy Workspace</DialogTitle>
            <DialogDescription>Specify the engine to which you want to deploy the current workspace.</DialogDescription>
          </DialogHeader>
          <Flex direction='column' gap={2}>
            <BasicField label='Engine Url'>
              <Input value={engineUrl} onChange={e => setEngineUrl(e.target.value)} />
            </BasicField>
            <BasicField label='Application Name'>
              <Input value={appName} onChange={e => setAppName(e.target.value)} />
            </BasicField>
            <BasicField label='User'>
              <Input value={user} onChange={e => setUser(e.target.value)} />
            </BasicField>
            <BasicField label='Password'>
              <PasswordInput value={password} onChange={pw => setPassword(pw)} />
            </BasicField>
          </Flex>
          <DialogFooter>
            {deploying! ? (
              <Button variant='primary' size='large' disabled>
                <Spinner size='small' style={{ borderColor: 'inherit', borderBottomColor: 'transparent' }} />
              </Button>
            ) : (
              <Button variant='primary' size='large' onClick={deploy} icon={IvyIcons.Bpmn} disabled={deploying}>
                Deploy
              </Button>
            )}
            <DialogClose asChild>
              <Button variant='outline' size='large' icon={IvyIcons.Close}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

const DeployLogContent = (log: string) => (
  <DialogContent style={{ gridTemplateRows: 'auto 1fr auto', maxHeight: '80%', maxWidth: '80%' }}>
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
);
