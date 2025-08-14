import {
  BasicDialogContent,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  hotkeyText,
  Input,
  IvyIcon,
  useDialogHotkeys,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { Link, useNavigate, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import type { ProjectBean } from '~/data/generated/ivy-client';
import { useDeleteProject, useProjectsApi, useSortedProjects } from '~/data/project-api';
import { useDownloadWorkspace, useImportProjectsIntoWs, useWorkspace } from '~/data/workspace-api';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import type { Tag } from '~/neo/overview/artifact/ArtifactTag';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewRecentlyOpened } from '~/neo/overview/OverviewRecentlyOpened';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { ProjectGraph } from './ProjectGraph';

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Home - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: 'Workspace home view' }];
};

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useSortedProjects();
  const { ws } = useParams();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (project, search) => project.id.pmv.includes(search));
  return (
    <Overview>
      <Breadcrumbs />
      <OverviewTitle title={t('workspaces.wsTitle', { workspace: ws })} description={t('workspaces.description')} />
      <OverviewRecentlyOpened />
      <OverviewTitle title={t('neo.projects')}>
        <ImportMenu />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter} viewTypes={{ graph: true }} />
      <OverviewContent isPending={isPending} viewType={overviewFilter.viewType} viewTypes={{ graph: <ProjectGraph /> }}>
        {filteredAritfacts.map(p => (
          <ProjectCard key={p.id.pmv} project={p} />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const ImportMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hotkeys = useKnownHotkeys();
  const { open, onOpenChange } = useDialogHotkeys(['importDialog']);
  useHotkeys(hotkeys.importFromMarket.hotkey, () => navigate('market'), { scopes: ['neo'] });
  useHotkeys(hotkeys.importFromFile.hotkey, () => onOpenChange(true), { scopes: ['neo'] });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button title={t('workspaces.importProject')} icon={IvyIcons.Download} size='xl' variant='primary-outline'>
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
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <IvyIcon icon={IvyIcons.Download} />
                <span>{t('workspaces.importFile')}</span>
                <DropdownMenuShortcut>{hotkeyText(hotkeys.importFromFile.hotkey)}</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <ImportDialogContent />
      </DialogContent>
    </Dialog>
  );
};

const ImportDialogContent = () => {
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
    <BasicDialogContent
      title={t('workspaces.importInto', { workspace: ws })}
      description={
        <>
          <div>{t('workspaces.importWarning')}</div>
          <Link onClick={downloadWorkspace} to={{}}>
            {t('workspaces.importWarningLink')}
          </Link>
        </>
      }
      submit={
        <Button
          variant='primary'
          size='large'
          disabled={fileValidation !== undefined}
          onClick={() => (file ? importAction(file) : {})}
          icon={IvyIcons.Download}
        >
          {t('common.label.import')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
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
    </BasicDialogContent>
  );
};

const ProjectCard = ({ project }: { project: ProjectBean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteProject } = useDeleteProject();
  const ws = useWorkspace();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const defaultProject = project.id.pmv === ws?.name;
  const { tagsFor } = useTags();
  const tags = tagsFor(project, defaultProject);
  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={project.id.pmv}
      onClick={() => navigate(`projects/${project.id.app}/${project.id.pmv}`)}
      preview={<PreviewSvg type='workspace' />}
      tags={tags}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => deleteProject(project.id),
          isDeletable: !defaultProject && project.isDeletable,
          message: defaultProject ? t('workspaces.deleteWarning.mainProject') : t('workspaces.deleteWarning.requiredByOtherProjects'),
          artifact: t('artifact.type.project')
        }}
        {...dialogState}
      />
    </ArtifactCard>
  );
};

const useTags = () => {
  const { t } = useTranslation();
  const allTags: Array<string> = [t('common.label.readOnly'), t('common.label.default')];
  const tagsFor = (project: ProjectBean, defaultProject: boolean) => {
    const tags: Array<Tag> = [];
    if (project.id.isIar) {
      tags.push({ label: allTags[0], tagStyle: 'secondary' });
    }
    if (defaultProject) {
      tags.push({ label: allTags[1], tagStyle: 'primary' });
    }
    return tags;
  };
  return { allTags, tagsFor };
};
