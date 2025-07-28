import {
  BasicDialogContent,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  Flex,
  hotkeyText,
  Input,
  IvyIcon,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useNavigate } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useCreateWorkspace, useDeleteWorkspace, useDeployWorkspace, useWorkspaces, type Workspace } from '~/data/workspace-api';
import { useArtifactValidation } from '~/neo/artifact/validation';
import { ControlBar } from '~/neo/control-bar/ControlBar';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { LanguageSettings } from '~/neo/settings/LanguageSettings';
import { Settings } from '~/neo/settings/Settings';
import { ThemeSettings } from '~/neo/settings/ThemeSettings';
import { useDownloadWorkspace } from '~/neo/workspace/useDownloadWorkspace';
import { DeployDialog } from '~/routes/workspaces/DeployDialog';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { useMergeRefs } from '~/utils/merge-refs';
import welcomeSvgUrl from '/assets/welcome.svg?url';

export const meta: MetaFunction = () => {
  return [{ title: `Welcome - ${NEO_DESIGNER}` }, { name: 'description', content: `Welcome page of ${NEO_DESIGNER}` }];
};

export default function Index() {
  const { t } = useTranslation();
  const overviewFilter = useOverviewFilter();
  const { data, isPending } = useWorkspaces();
  const workspaces = data?.filter(ws => ws.name.toLocaleLowerCase().includes(overviewFilter.search.toLocaleLowerCase())) ?? [];

  return (
    <>
      <ControlBar>
        <Flex alignItems='center' gap={1} style={{ paddingInline: 'var(--size-2)', marginInlineStart: 'auto', flex: '0 0 auto' }}>
          <Settings side='bottom'>
            <LanguageSettings />
            <ThemeSettings />
          </Settings>
        </Flex>
      </ControlBar>
      <div style={{ height: 'calc(100vh - 41px)' }}>
        <div style={{ height: '100%', overflowY: 'auto' }}>
          <Flex direction='column'>
            <WelcomeHeader />
            <Overview>
              <OverviewTitle
                title={t('workspaces.manageWorkspaces')}
                description={t('workspaces.newWorkspaceDescription')}
                info={t('workspaces.info')}
              >
                <NewWorkspaceButton />
              </OverviewTitle>
              <OverviewFilter {...overviewFilter} />
              <OverviewContent isPending={isPending}>
                <WorkspacesOverview workspaces={workspaces} />
              </OverviewContent>
            </Overview>
          </Flex>
        </div>
      </div>
    </>
  );
}

const WelcomeHeader = () => {
  const { t } = useTranslation();
  return (
    <Flex
      className='welcome-card'
      style={{
        margin: 30,
        marginBlockEnd: 0,
        backgroundImage: `url(${welcomeSvgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        height: 154,
        borderRadius: 'var(--border-r3)'
      }}
    >
      <Flex direction='row' gap={1} style={{ padding: 20 }}>
        <span style={{ color: 'white', fontSize: 22, fontWeight: 500 }}>{t('workspaces.title', { neo: NEO_DESIGNER })}</span>
      </Flex>
    </Flex>
  );
};

const WorkspacesOverview = ({ workspaces }: { workspaces: Workspace[] }) => {
  const [workspaceId, setWorkspaceId] = useState<string>();
  const { open, onOpenChange } = useDialogHotkeys(['deployDialog']);
  const { deployWorkspace } = useDeployWorkspace();
  return (
    <>
      {workspaces.map(workspace => (
        <WorkspaceCard
          key={workspace.name}
          {...workspace}
          deployWorkspace={() => {
            setWorkspaceId(workspace.id);
            onOpenChange(true);
          }}
        />
      ))}
      <DeployDialog
        open={open}
        onOpenChange={onOpenChange}
        deployAction={params => {
          if (workspaceId) {
            return deployWorkspace({ workspaceId, ...params });
          }
          return Promise.reject(new Error('No workspace selected'));
        }}
      />
    </>
  );
};

const WorkspaceCard = ({
  id,
  name,
  deployWorkspace
}: Pick<Workspace, 'id' | 'name'> & { deployWorkspace: (workspaceId: string) => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteWorkspace } = useDeleteWorkspace();
  const downloadWorkspace = useDownloadWorkspace(id);
  const hotkeys = useKnownHotkeys();
  const cardRef = useHotkeys(
    [hotkeys.exportWorkspace.hotkey, hotkeys.deployWorkspace.hotkey],
    (_, { hotkey }) => {
      switch (hotkey) {
        case hotkeys.deployWorkspace.hotkey:
          deployWorkspace(id);
          break;
        case hotkeys.exportWorkspace.hotkey:
          downloadWorkspace();
          break;
      }
    },
    { keydown: false, keyup: true }
  );
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const ref = useMergeRefs<HTMLDivElement>([cardRef, artifactCardRef]);

  return (
    <ArtifactCard name={name} onClick={() => navigate(id)} preview={<PreviewSvg type='workspace' />} ref={ref}>
      <ArtifactCardMenu
        deleteAction={{ run: () => deleteWorkspace(id), isDeletable: true, artifact: t('artifact.type.workspace') }}
        {...dialogState}
      >
        <DropdownMenuItem onSelect={downloadWorkspace} aria-label={hotkeys.exportWorkspace.label}>
          <IvyIcon icon={IvyIcons.Upload} />
          <span>{t('common.label.export')}</span>
          <DropdownMenuShortcut>{hotkeyText(hotkeys.exportWorkspace.hotkey)}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => deployWorkspace(id)} aria-label={hotkeys.deployWorkspace.label}>
          <IvyIcon icon={IvyIcons.Bpmn} />
          <span>{t('common.label.deploy')}</span>
          <DropdownMenuShortcut>{hotkeyText(hotkeys.deployWorkspace.hotkey)}</DropdownMenuShortcut>
        </DropdownMenuItem>
      </ArtifactCardMenu>
    </ArtifactCard>
  );
};

const NewWorkspaceButton = () => {
  const { t } = useTranslation();
  const { open, onOpenChange } = useDialogHotkeys(['newWorkspaceDialog']);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateNewArtefactButton title={t('workspaces.newWorkspace')} open={() => onOpenChange(true)} />
      <DialogContent>
        <NewWorkspaceDialogContent closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

const NewWorkspaceDialogContent = ({ closeDialog }: { closeDialog: () => void }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const { artifactAlreadyExists, validateArtifactName } = useArtifactValidation();
  const workspaces = useWorkspaces();
  const navigate = useNavigate();
  const { createWorkspace } = useCreateWorkspace();
  const create = (name: string) => createWorkspace({ name }).then(ws => navigate(ws.id));
  const nameValidation = useMemo(
    () =>
      workspaces.data?.find(w => w.name.toLowerCase() === name.toLowerCase()) ? artifactAlreadyExists(name) : validateArtifactName(name),
    [artifactAlreadyExists, name, validateArtifactName, workspaces.data]
  );
  const hasErros = useMemo(() => nameValidation?.variant === 'error', [nameValidation]);
  const createNewWorkspace = () => {
    if (!hasErros) {
      closeDialog();
      create(name);
    }
  };
  const enter = useHotkeys('Enter', createNewWorkspace, { scopes: ['newWorkspaceDialog'], enableOnFormTags: true });
  return (
    <BasicDialogContent
      title={t('workspaces.newWorkspace')}
      description={t('workspaces.newWorkspaceDescription')}
      cancel={
        <Button size='large' variant='outline'>
          {t('common.label.cancel')}
        </Button>
      }
      submit={
        <Button disabled={hasErros} icon={IvyIcons.Plus} size='large' variant='primary' onClick={createNewWorkspace}>
          {t('common.label.create')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('common.label.name')} message={nameValidation}>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </BasicField>
    </BasicDialogContent>
  );
};
