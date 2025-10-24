import { BasicDialogContent, BasicField, Button, Dialog, DialogContent, Input, PasswordInput, toast } from '@axonivy/ui-components';
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
  const [log, setLog] = useState<string>();
  const [deploying, setDeploying] = useState(false);
  const deploy = (params: DeployActionParams) => {
    setDeploying(true);
    deployAction(params)
      .then(setLog)
      .finally(() => setDeploying(false));
  };
  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        onOpenChange(open);
        setLog(undefined);
      }}
    >
      <DialogContent>{log ? <DeployLogContent log={log} /> : <DeployDialogContent deploying={deploying} deploy={deploy} />}</DialogContent>
    </Dialog>
  );
};

const DeployDialogContent = ({ deploying, deploy }: { deploying: boolean; deploy: (params: DeployActionParams) => void }) => {
  const { t } = useTranslation();
  const [engineUrl, setEngineUrl] = useState(window.location.origin);
  const [appName, setAppName] = useState('myApp');
  const [user, setUser] = useState('admin');
  const [password, setPassword] = useState('admin');
  return (
    <BasicDialogContent
      title={t('deploy.deployWs')}
      description={t('deploy.target')}
      submit={
        <Button
          variant='primary'
          size='large'
          onClick={e => {
            e.preventDefault();
            deploy({ applicationName: appName, engineUrl, user, password });
          }}
          disabled={deploying}
          icon={deploying ? IvyIcons.Spinner : IvyIcons.Bpmn}
          spin={deploying}
        >
          {t('common.label.deploy')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
    >
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
    </BasicDialogContent>
  );
};

const DeployLogContent = ({ log }: { log: string }) => {
  const { t } = useTranslation();
  return (
    <BasicDialogContent
      title={t('deploy.log')}
      description={t('deploy.logDescription')}
      cancel={
        <Button
          variant='outline'
          size='large'
          icon={IvyIcons.Note}
          onClick={e => {
            e.preventDefault();
            navigator.clipboard.writeText(log).then(() => toast.success(t('deploys.copiedLog')));
          }}
        >
          {t('deploys.closeLog')}
        </Button>
      }
      submit={
        <Button variant='primary' size='large' icon={IvyIcons.Close}>
          {t('common.label.close')}
        </Button>
      }
    >
      <pre>
        <code>{log}</code>
      </pre>
    </BasicDialogContent>
  );
};
