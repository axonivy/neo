import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Fieldset,
  Flex,
  Input,
  SearchInput,
  Spinner
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useWorkspaces, useDeleteWorkspace, useCreateWorkspace, Workspace } from '~/data/workspace-api';
import { ControlBar } from '~/neo/ControlBar';
import { ArtifactCard, NewArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';

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
      <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Welcome to Axon Ivy NEO Designer</span>
        <Flex direction='row' alignItems='center' justifyContent='space-between'>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Please choose a workspace or create one</span>
        </Flex>
        <SearchInput value={search} onChange={setSearch} />
        <Flex gap={4} style={{ flexWrap: 'wrap' }}>
          {isPending ? (
            <Spinner size='small' />
          ) : (
            <>
              <NewWorkspaceCard />
              {workspaces.map(workspace => (
                <WorkspaceCard key={workspace.name} {...workspace} />
              ))}
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
}

const WorkspaceCard = (workspace: Workspace) => {
  const navigate = useNavigate();
  const { deleteWorkspace } = useDeleteWorkspace();
  const open = () => navigate(workspace.name);
  const deleteAction = () => deleteWorkspace(workspace.id);
  return <ArtifactCard name={workspace.name} type='workspace' onClick={open} actions={{ delete: deleteAction }} />;
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
          <Fieldset label='Name'>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </Fieldset>
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
