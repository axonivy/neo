import {
  BasicDialog,
  BasicField,
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Flex,
  Input,
  PasswordInput,
  Spinner,
  toast
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DeployParams } from '~/data/workspace-api';

export type DeployActionParams = Omit<DeployParams, 'workspaceId'>;

type DeployDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deployAction: (params: DeployActionParams) => Promise<string>;
};

export const DeployDialog = ({ open, onOpenChange, deployAction }: DeployDialogProps) => {
  const { t } = useTranslation();
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
    <BasicDialog
      open={open}
      contentProps={{
        title: t('deploy.deployWs'),
        description: t('deploy.target')
      }}
      onOpenChange={open => {
        onOpenChange(open);
        setLog(undefined);
      }}
    >
      {log ? (
        <DeployLogContent log={log} />
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deploy.deployWs')}</DialogTitle>
            <DialogDescription>{t('deploy.target')}</DialogDescription>
          </DialogHeader>
          <Flex direction='column' gap={2}>
            <BasicField label={t('deploy.engineUrl')}>
              <Input value={engineUrl} onChange={e => setEngineUrl(e.target.value)} />
            </BasicField>
            <BasicField label={t('deploy.applicationName')}>
              <Input value={appName} onChange={e => setAppName(e.target.value)} />
            </BasicField>
            <BasicField label={t('common.label.user')}>
              <Input value={user} onChange={e => setUser(e.target.value)} />
            </BasicField>
            <BasicField label={t('common.label.password')}>
              <PasswordInput value={password} onChange={pw => setPassword(pw)} />
            </BasicField>
          </Flex>
          <DialogFooter>
            {deploying ? (
              <Button variant='primary' size='large' disabled>
                <Spinner size='small' style={{ borderColor: 'inherit', borderBottomColor: 'transparent' }} />
              </Button>
            ) : (
              <Button variant='primary' size='large' onClick={deploy} icon={IvyIcons.Bpmn}>
                {t('common.label.deploy')}
              </Button>
            )}
            <DialogClose asChild>
              <Button variant='outline' size='large' icon={IvyIcons.Close}>
                {t('common.label.cancel')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </BasicDialog>
  );
};

const DeployLogContent = ({ log }: { log: string }) => {
  const { t } = useTranslation();
  return (
    <DialogContent style={{ gridTemplateRows: 'auto 1fr auto', maxHeight: '80%', maxWidth: '80%' }}>
      <DialogHeader>
        <DialogTitle>{t('deploy.log')}</DialogTitle>
        <DialogDescription>{t('deploy.logDescription')}</DialogDescription>
      </DialogHeader>
      <pre style={{ overflow: 'auto' }}>
        <code>{log}</code>
      </pre>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='primary' size='large' icon={IvyIcons.Close}>
            {t('common.label.close')}
          </Button>
        </DialogClose>
        <Button
          variant='outline'
          size='large'
          icon={IvyIcons.Note}
          onClick={() => navigator.clipboard.writeText(log).then(() => toast.success(t('deploys.copiedLog')))}
        >
          {t('deploys.closeLog')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
