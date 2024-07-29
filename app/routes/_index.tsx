import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Fieldset,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useCreateWorkspace, useDeleteWorkspace, useExportWorkspace, useWorkspaces, Workspace } from '~/data/workspace-api';
import { ControlBar } from '~/neo/ControlBar';
import { Overview } from '~/neo/Overview';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';

export const links: LinksFunction = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useWorkspaces();
  const workspaces = data?.filter(ws => ws.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <>
      <ControlBar />
      <Overview
        title='Welcome to Axon Ivy NEO Designer'
        description='Please choose a workspace or create one'
        search={search}
        onSearchChange={setSearch}
        isPending={isPending}
      >
        <NewWorkspaceCard />
        {workspaces.map(workspace => (
          <WorkspaceCard key={workspace.name} {...workspace} />
        ))}
      </Overview>
    </>
  );
}

const WorkspaceCard = (workspace: Workspace) => {
  const navigate = useNavigate();
  const { deleteWorkspace } = useDeleteWorkspace();
  const { exportWorkspace } = useExportWorkspace();
  const open = () => navigate(workspace.name);
  const deleteAction = () => deleteWorkspace(workspace.id);
  const exportAction = (name: string) => {
    exportWorkspace(workspace.id).then(zip => {
      if (!(zip instanceof Blob)) {
        return;
      }
      const url = window.URL.createObjectURL(zip);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}.zip`);
      link.click();
    });
  };
  return <ArtifactCard name={workspace.name} type='workspace' onClick={open} actions={{ delete: deleteAction, export: exportAction }} />;
};

const NewWorkspaceCard = () => {
  const [dialogState, setDialogState] = useState(false);
  const [name, setName] = useState('MyNewWorkspace');
  const navigate = useNavigate();
  const { createWorkspace } = useCreateWorkspace();
  const create = (name: string) => createWorkspace({ name }).then(ws => navigate(ws.name));
  return (
    <>
      <NewArtifactCard open={() => setDialogState(true)} title='Create new Workspace' />
      <Dialog open={dialogState} onOpenChange={() => setDialogState(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Workspace</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              create(name);
            }}
          >
            <Fieldset label='Name'>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </Fieldset>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button icon={IvyIcons.Plus} variant='primary' onClick={() => create(name)}>
                Create
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button icon={IvyIcons.Close} variant='outline'>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
