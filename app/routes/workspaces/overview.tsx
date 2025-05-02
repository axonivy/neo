import {
  BasicField,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Flex,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useNavigate } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useCreateWorkspace, useDeleteWorkspace, useDeployWorkspace, useWorkspaces, type Workspace } from '~/data/workspace-api';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import type { DeployActionParams } from '~/neo/artifact/DeployDialog';
import { useArtifactValidation } from '~/neo/artifact/validation';
import { ControlBar } from '~/neo/control-bar/ControlBar';
import { InfoPopover } from '~/neo/InfoPopover';
import { Overview } from '~/neo/Overview';
import { LanguageSelector } from '~/neo/settings/LanguageSelector';
import { ThemeSettings } from '~/neo/settings/ThemeSettings';
import { useSearch } from '~/neo/useSearch';
import { useDownloadWorkspace } from '~/neo/workspace/useDownloadWorkspace';
import welcomeSvgUrl from './welcome.svg?url';
import PreviewSVG from './workspace-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = () => {
  return [{ title: `Welcome - ${NEO_DESIGNER}` }, { name: 'description', content: `Welcome page of ${NEO_DESIGNER}` }];
};

export default function Index() {
  const { t } = useTranslation();
  const { search, setSearch } = useSearch();
  const { data, isPending } = useWorkspaces();
  const workspaces = data?.filter(ws => ws.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const title = t('workspaces.title', { neo: NEO_DESIGNER });
  const info = t('workspaces.info');

  return (
    <>
      <ControlBar>
        <Flex alignItems='center' gap={1} style={{ paddingInline: 'var(--size-2)', marginInlineStart: 'auto', flex: '0 0 auto' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon={IvyIcons.Settings} size='large' aria-label={t('common.label.settings')} title={t('common.label.settings')} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side='bottom'>
              <LanguageSelector />
              <ThemeSettings />
            </DropdownMenuContent>
          </DropdownMenu>
        </Flex>
      </ControlBar>
      <div style={{ height: 'calc(100vh - 41px)' }}>
        <div style={{ height: '100%', overflowY: 'auto' }}>
          <Flex direction='column'>
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
                <span style={{ color: 'white', fontSize: 22, fontWeight: 500 }}>{title}</span>
                <InfoPopover info={info}>
                  <Button size='large' style={{ color: 'white' }} icon={IvyIcons.InfoCircle} />
                </InfoPopover>
              </Flex>
            </Flex>
            <Overview search={search} onSearchChange={setSearch} isPending={isPending}>
              <NewWorkspaceCard />
              {workspaces.map(workspace => (
                <WorkspaceCard key={workspace.name} {...workspace} />
              ))}
            </Overview>
          </Flex>
        </div>
      </div>
    </>
  );
}

const WorkspaceCard = (workspace: Workspace) => {
  const navigate = useNavigate();
  const { deleteWorkspace } = useDeleteWorkspace();
  const downloadWorkspace = useDownloadWorkspace(workspace.id);
  const { deployWorkspace } = useDeployWorkspace();
  const open = () => navigate(workspace.id);
  const deployAction = (params: DeployActionParams) => {
    return deployWorkspace({ workspaceId: workspace.id, ...params });
  };

  const deleteAction = {
    run: () => deleteWorkspace(workspace.id),
    isDeletable: true
  };

  return (
    <ArtifactCard
      name={workspace.name}
      type='workspace'
      onClick={open}
      actions={{ delete: deleteAction, export: downloadWorkspace, deploy: deployAction }}
      preview={<PreviewSVG />}
    />
  );
};

const NewWorkspaceCard = () => {
  const { t } = useTranslation();
  const { artifactAlreadyExists, validateArtifactName } = useArtifactValidation();
  const [dialogState, setDialogState] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { createWorkspace } = useCreateWorkspace();
  const create = (name: string) => createWorkspace({ name }).then(ws => navigate(ws.id));
  const workspaces = useWorkspaces();
  const nameValidation = useMemo(
    () =>
      workspaces.data?.find(w => w.name.toLowerCase() === name.toLowerCase()) ? artifactAlreadyExists(name) : validateArtifactName(name),
    [artifactAlreadyExists, name, validateArtifactName, workspaces.data]
  );
  return (
    <>
      <NewArtifactCard open={() => setDialogState(true)} title={t('workspaces.newWorkspace')} />
      <Dialog open={dialogState} onOpenChange={() => setDialogState(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('workspaces.newWorkspace')}</DialogTitle>
          </DialogHeader>
          <form>
            <Flex direction='column' gap={3}>
              <BasicField label={t('common.label.name')} message={nameValidation}>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </BasicField>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    disabled={nameValidation?.variant === 'error'}
                    icon={IvyIcons.Plus}
                    size='large'
                    variant='primary'
                    type='submit'
                    onClick={e => {
                      e.preventDefault();
                      setDialogState(false);
                      create(name);
                    }}
                  >
                    {t('common.label.create')}
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button icon={IvyIcons.Close} size='large' variant='outline'>
                    {t('common.label.cancel')}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </Flex>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
