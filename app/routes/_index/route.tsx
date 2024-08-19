import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Fieldset,
  Flex,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import {
  useCreateWorkspace,
  useDeleteWorkspace,
  useExportWorkspace,
  useImportWorkspace,
  useWorkspaces,
  Workspace
} from '~/data/workspace-api';
import { ControlBar } from '~/neo/ControlBar';
import { Overview } from '~/neo/Overview';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { FileInput } from '~/neo/artifact/ImportDialog';
import PreviewSVG from './workspace-preview.svg?react';

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
  const { importWorkspace } = useImportWorkspace();
  const open = () => navigate(workspace.name);
  const deleteAction = () => deleteWorkspace(workspace.id);
  const exportAction = () => {
    exportWorkspace(workspace.id).then(zip => {
      if (!(zip instanceof Blob)) {
        return;
      }
      const url = window.URL.createObjectURL(zip);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workspace.name}.zip`;
      link.click();
    });
  };
  const importAction = (file: File) => importWorkspace(workspace.id, file, file.name);

  return (
    <ArtifactCard
      name={workspace.name}
      type='workspace'
      onClick={open}
      actions={{ delete: deleteAction, export: exportAction, import: importAction }}
      preview={<PreviewSVG />}
    />
  );
};

const NewWorkspaceCard = () => {
  const [dialogState, setDialogState] = useState(false);
  const [name, setName] = useState('MyNewWorkspace');
  const navigate = useNavigate();
  const { createWorkspace } = useCreateWorkspace();
  const { importWorkspace } = useImportWorkspace();
  const [file, setFile] = useState<File>();
  const create = (name: string) =>
    createWorkspace({ name }).then(ws =>
      file ? importWorkspace(ws.id, file, file.name).then(() => navigate(ws.name)) : navigate(ws.name)
    );
  return (
    <>
      <NewArtifactCard open={() => setDialogState(true)} title='Create new Workspace' />
      <Dialog open={dialogState} onOpenChange={() => setDialogState(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Workspace</DialogTitle>
            <DialogDescription>
              Optionally, you can select and upload existing Axon Ivy projects, which are then added to the workspace.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              create(name);
            }}
          >
            <Flex direction='column' gap={2}>
              <Fieldset label='Name'>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </Fieldset>
              {FileInput(setFile)}
            </Flex>
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
