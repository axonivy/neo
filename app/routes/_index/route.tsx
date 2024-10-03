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
  useDeployWorkspace,
  useImportWorkspace,
  useWorkspaces,
  Workspace
} from '~/data/workspace-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { DeployActionParams } from '~/neo/artifact/DeployDialog';
import { FileInput } from '~/neo/artifact/FileInput';
import { useDownloadWorkspace } from '~/neo/artifact/useDownloadWorkspace';
import { ControlBar } from '~/neo/control-bar/ControlBar';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './workspace-preview.svg?react';

export const links: LinksFunction = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useWorkspaces();
  const workspaces = data?.filter(ws => ws.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const description =
    "Here you will find all the applications you've created or imported. Create a new application by clicking on the blue box and open an existing one by clicking on one of the grey boxes.";
  const title = 'Welcome to Axon Ivy NEO Designer';
  return (
    <>
      <ControlBar />
      <Overview title={title} description={description} search={search} onSearchChange={setSearch} isPending={isPending}>
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
  const { downloadWorkspace } = useDownloadWorkspace(workspace.id);
  const { deployWorkspace } = useDeployWorkspace();
  const open = () => navigate(workspace.name);
  const deleteAction = () => deleteWorkspace(workspace.id);
  const deployAction = (params: DeployActionParams) => {
    return deployWorkspace({ workspaceId: workspace.id, ...params });
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
      <NewArtifactCard open={() => setDialogState(true)} title='Create new Application' />
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
            <Flex direction='column' gap={3}>
              <BasicField label='Name'>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </BasicField>
              <FileInput setFile={setFile} />
            </Flex>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button icon={IvyIcons.Plus} size='large' variant='primary' onClick={() => create(name)}>
                Create
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button icon={IvyIcons.Close} size='large' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
