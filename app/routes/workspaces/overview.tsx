import { BasicDialog, BasicField, Button, Flex, Input, useHotkeyLocalScopes } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useNavigate } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useCreateWorkspace, useDeleteWorkspace, useDeployWorkspace, useWorkspaces, type Workspace } from '~/data/workspace-api';
import { ArtifactCard, cardStylesLink } from '~/neo/artifact/ArtifactCard';
import type { DeployActionParams } from '~/neo/artifact/DeployDialog';
import { PreviewSvg } from '~/neo/artifact/PreviewSvg';
import { useArtifactValidation } from '~/neo/artifact/validation';
import { ControlBar } from '~/neo/control-bar/ControlBar';
import { InfoPopover } from '~/neo/InfoPopover';
import { CreateNewArtefactButton, Overview } from '~/neo/Overview';
import { LanguageSettings } from '~/neo/settings/LanguageSettings';
import { Settings } from '~/neo/settings/Settings';
import { ThemeSettings } from '~/neo/settings/ThemeSettings';
import { useSearch } from '~/neo/useSearch';
import { useDownloadWorkspace } from '~/neo/workspace/useDownloadWorkspace';
import welcomeSvgUrl from '/assets/welcome.svg?url';

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
          <Settings side='bottom'>
            <LanguageSettings />
            <ThemeSettings />
          </Settings>
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
            <Overview search={search} onSearchChange={setSearch} isPending={isPending} control={<NewWorkspaceButton />}>
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
      preview={<PreviewSvg type='workspace' />}
    />
  );
};

const NewWorkspaceButton = () => {
  const { t } = useTranslation();
  const { artifactAlreadyExists, validateArtifactName } = useArtifactValidation();
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['newWorkspaceDialog']);
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
  const onDialogOpenChange = (open: boolean) => {
    setDialogState(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameValidation?.variant !== 'error') {
      setDialogState(false);
      create(name);
    }
  };

  return (
    <>
      <CreateNewArtefactButton title={t('workspaces.importProject')} open={() => onDialogOpenChange(true)} />
      <BasicDialog
        open={dialogState}
        onOpenChange={() => onDialogOpenChange(false)}
        contentProps={{
          title: t('workspaces.newWorkspace'),
          description: t('workspaces.newWorkspaceDescription'),
          buttonClose: (
            <Button icon={IvyIcons.Close} size='large' variant='outline'>
              {t('common.label.cancel')}
            </Button>
          ),
          buttonCustom: (
            <Button
              disabled={nameValidation?.variant === 'error'}
              icon={IvyIcons.Plus}
              size='large'
              variant='primary'
              type='submit'
              onClick={formSubmitHandler}
            >
              {t('common.label.create')}
            </Button>
          )
        }}
      >
        <form onSubmit={formSubmitHandler}>
          <Flex direction='column' gap={3}>
            <BasicField label={t('common.label.name')} message={nameValidation}>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </BasicField>
          </Flex>
        </form>
      </BasicDialog>
    </>
  );
};
