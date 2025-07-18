import {
  BasicDialog,
  BasicField,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Flex,
  hotkeyText,
  Input,
  IvyIcon,
  useHotkeyLocalScopes,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { Link, useNavigate, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import type { ProjectBean } from '~/data/generated/ivy-client';
import { useDeleteProject, useProjectsApi, useSortedProjects } from '~/data/project-api';
import { useImportProjectsIntoWs, useWorkspace } from '~/data/workspace-api';
import { ArtifactCard, cardStylesLink } from '~/neo/artifact/ArtifactCard';
import { ArtifactInfoCard } from '~/neo/artifact/ArtifactInfoCard';
import { PreviewSvg } from '~/neo/artifact/PreviewSvg';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Overview } from '~/neo/Overview';
import { useSearch } from '~/neo/useSearch';
import { useDownloadWorkspace } from '~/neo/workspace/useDownloadWorkspace';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { ProjectGraph } from './ProjectGraph';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Home - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: 'Workspace home view' }];
};

export default function Index() {
  const { t } = useTranslation();
  const { search, setSearch } = useSearch();
  const { data, isPending } = useSortedProjects();
  const [open, setOpen] = useState(false);
  const { ws } = useParams();
  const projects = data?.filter(({ id }) => id.pmv.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const title = t('workspaces.wsTitle', { workspace: ws });

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <Flex direction='column' gap={1} style={{ height: '100%' }}>
        <Flex direction='column' gap={4} style={{ fontSize: 16, padding: 30, paddingBottom: 0 }} className='app-info'>
          <span style={{ fontWeight: 600 }}>{title}</span>
          <span style={{ fontWeight: 400, color: 'var(--N900)' }}>{t('workspaces.description')}</span>
          <Flex direction='row' gap={4} style={{ flexWrap: 'wrap' }}>
            <ArtifactInfoCard
              title={t('neo.processes')}
              description={t('processes.processDescription')}
              icon={IvyIcons.Process}
              link='processes'
            />
            <ArtifactInfoCard
              title={t('neo.dataClasses')}
              description={t('dataclasses.dataclassDescription')}
              icon={IvyIcons.Database}
              link='dataClasses'
            />
            <ArtifactInfoCard title={t('neo.forms')} description={t('forms.formDescription')} icon={IvyIcons.File} link='forms' />
            <ArtifactInfoCard
              title={t('neo.configs')}
              description={t('configurations.configDescription')}
              icon={IvyIcons.Tool}
              link='configurations'
            />
          </Flex>
        </Flex>
        <Overview
          title={t('neo.projects')}
          search={search}
          onSearchChange={setSearch}
          isPending={isPending}
          graph={{ graph: <ProjectGraph /> }}
          control={<ImportMenu open={open} setOpen={setOpen} />}
        >
          {projects.map(p => (
            <ProjectCard key={p.id.pmv} project={p} />
          ))}
        </Overview>
      </Flex>
    </div>
  );
}

const ImportMenu = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const { t } = useTranslation();
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
          <Button
            title={t('workspaces.importProject')}
            icon={IvyIcons.Download}
            size='large'
            variant='primary'
            onClick={() => setOpen(true)}
            style={{ height: '32px' }}
          >
            {t('workspaces.importProject')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='import-menu'>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => navigate('market')} aria-label={hotkeys.importFromMarket.label}>
              <IvyIcon icon={IvyIcons.Market} />
              <span>{t('workspaces.importMarket')}</span>
              <DropdownMenuShortcut>{hotkeyText(hotkeys.importFromMarket.hotkey)}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                onDialogOpenChange(true);
              }}
              aria-label={hotkeys.importFromFile.label}
            >
              <IvyIcon icon={IvyIcons.Download} />
              <span>{t('workspaces.importFile')}</span>
              <DropdownMenuShortcut>{hotkeyText(hotkeys.importFromFile.hotkey)}</DropdownMenuShortcut>
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
  const { t } = useTranslation();
  const [file, setFile] = useState<File>();
  const downloadWorkspace = useDownloadWorkspace();
  const { importProjects } = useImportProjectsIntoWs();
  const { queryKey } = useProjectsApi();
  const client = useQueryClient();
  const [project, setProject] = useState<ProjectBean>();
  const importAction = (file: File) => importProjects(ws ?? '', file, project?.id).finally(() => client.invalidateQueries({ queryKey }));
  const fileValidation = useMemo<MessageData | undefined>(
    () => (file ? undefined : { message: t('message.invalidIar'), variant: 'warning' }),
    [file, t]
  );

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      contentProps={{
        title: t('workspaces.importInto', { workspace: ws }),
        description: (
          <>
            <div>{t('workspaces.importWarning')}</div>
            <Link onClick={downloadWorkspace} to={{}}>
              {t('workspaces.importWarningLink')}
            </Link>
          </>
        ),
        buttonClose: (
          <Button variant='outline' size='large' icon={IvyIcons.Close}>
            {t('common.label.cancel')}
          </Button>
        ),
        buttonCustom: (
          <Button
            variant='primary'
            size='large'
            disabled={fileValidation !== undefined}
            onClick={() => (file ? importAction(file) : {})}
            icon={IvyIcons.Download}
          >
            {t('common.label.import')}
          </Button>
        )
      }}
    >
      <BasicField label={t('common.label.file')} message={fileValidation}>
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
      <ProjectSelect setProject={setProject} setDefaultValue={false} label={t('neo.addDependency')} projectFilter={p => !p.id.isIar} />
    </BasicDialog>
  );
};

const ProjectCard = ({ project }: { project: ProjectBean }) => {
  const { t } = useTranslation();
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
      preview={<PreviewSvg type='workspace' />}
      tagLabel={project.id.isIar ? t('common.label.readOnly') : undefined}
    />
  );
};
