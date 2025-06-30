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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  Input,
  IvyIcon,
  useHotkeyLocalScopes,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { LinksFunction, MetaFunction } from 'react-router';
import { Link, useNavigate, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import type { ProjectBean } from '~/data/generated/ivy-client';
import { useDeleteProject, useProjectsApi, useSortedProjects } from '~/data/project-api';
import { useImportProjectsIntoWs, useWorkspace } from '~/data/workspace-api';
import { configDescription, dataClassDescription, formDescription, processDescription } from '~/neo/artifact/artifact-description';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactInfoCard } from '~/neo/artifact/ArtifactInfoCard';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Overview } from '~/neo/Overview';
import { useSearch } from '~/neo/useSearch';
import { useDownloadWorkspace } from '~/neo/workspace/useDownloadWorkspace';
import { useKnownHotkeys } from '~/utils/hotkeys';
import PreviewSVG from './workspace-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Home - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: 'Workspace home view' }];
};

export default function Index() {
  const { search, setSearch } = useSearch();
  const { data, isPending } = useSortedProjects();
  const [open, setOpen] = useState(false);
  const { ws } = useParams();
  const projects = data?.filter(({ id }) => id.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const title = `Welcome to your workspace: ${ws}`;

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <Flex direction='column' gap={1}>
        <Flex direction='column' gap={4} style={{ fontSize: 16, padding: 30, paddingBottom: 0 }} className='app-info'>
          <span style={{ fontWeight: 600 }}>{title}</span>
          <span style={{ fontWeight: 400, color: 'var(--N900)' }}>
            {
              'Here you can find the projects you have created along with any imported projects in this workspace. A project contains all the essential components needed to build an application.'
            }
          </span>
          <Flex direction='row' gap={4} style={{ flexWrap: 'wrap' }}>
            <ArtifactInfoCard title='Processes' description={processDescription} icon={IvyIcons.Process} link='processes' />
            <ArtifactInfoCard title='Data Classes' description={dataClassDescription} icon={IvyIcons.Database} link='dataClasses' />
            <ArtifactInfoCard title='Forms' description={formDescription} icon={IvyIcons.File} link='forms' />
            <ArtifactInfoCard title='Configurations' description={configDescription} icon={IvyIcons.Tool} link='configurations' />
          </Flex>
        </Flex>
        <Overview title={'Projects'} search={search} onSearchChange={setSearch} isPending={isPending}>
          <NewArtifactCard title='Import Projects' open={() => setOpen(true)} menu={<ImportMenu open={open} setOpen={setOpen} />} />
          {projects.map(p => (
            <ProjectCard key={p.id.pmv} project={p} />
          ))}
        </Overview>
      </Flex>
    </div>
  );
}

const ImportMenu = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const navigate = useNavigate();
  const hotkeys = useKnownHotkeys();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['importDialog']);
  useHotkeys(hotkeys.importFromMarket.hotkey, () => navigate('market'), { enableOnFormTags: true, scopes: ['neo'] });
  useHotkeys(
    hotkeys.importFromFile.hotkey,
    () => {
      onDialogOpenChange(true);
    },
    { scopes: ['neo'] }
  );
  const onDialogOpenChange = (open: boolean) => {
    setIsImportDialogOpen(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button icon={IvyIcons.Dots} className='card-menu-trigger' />
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='import-menu'>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                navigate('market');
              }}
              title={hotkeys.importFromMarket.label}
              aria-label={hotkeys.importFromMarket.label}
            >
              <IvyIcon icon={IvyIcons.Market} />
              <span>Import from Market</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                onDialogOpenChange(true);
              }}
              title={hotkeys.importFromFile.label}
              aria-label={hotkeys.importFromFile.label}
            >
              <IvyIcon icon={IvyIcons.Download} />
              <span>Import from File</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportDialog open={isImportDialogOpen} onOpenChange={onDialogOpenChange} />
    </>
  );
};

const ImportDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { ws } = useParams();
  const [file, setFile] = useState<File>();
  const downloadWorkspace = useDownloadWorkspace();
  const { importProjects } = useImportProjectsIntoWs();
  const { queryKey } = useProjectsApi();
  const client = useQueryClient();
  const [project, setProject] = useState<ProjectBean>();
  const importAction = (file: File) => importProjects(ws ?? '', file, project?.id).then(() => client.invalidateQueries({ queryKey }));
  const fileValidation = useMemo<MessageData | undefined>(
    () => (file ? undefined : { message: 'Select an .iar file or a .zip file that contains .iar files.', variant: 'warning' }),
    [file]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Axon Ivy Projects into: {ws}</DialogTitle>
          <DialogDescription>
            The import can overwrite existing project versions.{' '}
            <Link onClick={downloadWorkspace} to={{}}>
              Consider exporting the Workspace beforehand.
            </Link>
          </DialogDescription>
        </DialogHeader>
        <BasicField label='File' message={fileValidation}>
          <Input
            accept='.zip,.iar'
            type='file'
            onChange={e => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </BasicField>
        <ProjectSelect
          setProject={setProject}
          setDefaultValue={false}
          label='Add as dependency to project'
          projectFilter={p => !p.id.isIar}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='primary'
              size='large'
              disabled={fileValidation !== undefined}
              onClick={() => (file ? importAction(file) : {})}
              icon={IvyIcons.Download}
            >
              Import
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant='outline' size='large' icon={IvyIcons.Close}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProjectCard = ({ project }: { project: ProjectBean }) => {
  const navigate = useNavigate();
  const { deleteProject } = useDeleteProject();
  const ws = useWorkspace();
  const open = () => {
    navigate(`projects/${project.id.app}/${project.id.pmv}`);
  };
  const deleteAction = {
    run: () => {
      deleteProject(project.id);
    },
    isDeletable: project.id.pmv !== ws?.name && project.isDeletable,
    message:
      project.id.pmv == ws?.name
        ? 'Main project cannot be deleted.'
        : 'The project cannot be deleted as it is required by other projects in the workspace.'
  };
  return (
    <ArtifactCard
      name={project.id.pmv}
      type='project'
      actions={{ delete: deleteAction }}
      onClick={open}
      preview={<PreviewSVG />}
      tagLabel={project.id.isIar ? 'Read only' : undefined}
    />
  );
};
