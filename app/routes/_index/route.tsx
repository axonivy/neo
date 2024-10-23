import {
  BasicField,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Flex,
  Input,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useCreateWorkspace, useDeleteWorkspace, useDeployWorkspace, useWorkspaces, type Workspace } from '~/data/workspace-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import type { DeployActionParams } from '~/neo/artifact/DeployDialog';
import { validateNotEmpty } from '~/neo/artifact/validation';
import { ControlBar } from '~/neo/control-bar/ControlBar';
import { Overview } from '~/neo/Overview';
import { useDownloadWorkspace } from '~/neo/workspace/useDownloadWorkspace';
import PreviewSVG from './workspace-preview.svg?react';

export const links: LinksFunction = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useWorkspaces();
  const workspaces = data?.filter(ws => ws.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const description = 'Here you can access and manage your created workspaces.';
  const title = 'Welcome to Axon Ivy NEO Designer';
  const info =
    "A workspace is the development area where an application is built and tested. It's the space where your business processes are designed, previewed and simulated before they're deployed as a functioning application.";
  return (
    <div style={{ height: 'calc(100vh - 41px)' }}>
      <ControlBar />
      <Overview title={title} description={description} search={search} onSearchChange={setSearch} isPending={isPending} info={info}>
        <NewWorkspaceCard />
        {workspaces.map(workspace => (
          <WorkspaceCard key={workspace.name} {...workspace} />
        ))}
      </Overview>
    </div>
  );
}

const WorkspaceCard = (workspace: Workspace) => {
  const navigate = useNavigate();
  const { deleteWorkspace } = useDeleteWorkspace();
  const downloadWorkspace = useDownloadWorkspace(workspace.id);
  const { deployWorkspace } = useDeployWorkspace();
  const open = () => navigate(workspace.name);
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
  const [dialogState, setDialogState] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { createWorkspace } = useCreateWorkspace();
  const create = (name: string) => createWorkspace({ name }).then(ws => navigate(ws.name));
  const nameValidation = useMemo<MessageData | undefined>(() => validateNotEmpty(name, 'name', 'workspace'), [name]);
  return (
    <>
      <NewArtifactCard open={() => setDialogState(true)} title='Create new Workspace' />
      <Dialog open={dialogState} onOpenChange={() => setDialogState(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Workspace</DialogTitle>
          </DialogHeader>
          <form>
            <Flex direction='column' gap={3}>
              <BasicField label='Name' message={nameValidation}>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </BasicField>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    disabled={nameValidation !== undefined}
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
                    Create
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button icon={IvyIcons.Close} size='large' variant='outline'>
                    Cancel
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
