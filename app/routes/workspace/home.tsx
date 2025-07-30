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
  Flex,
  hotkeyText,
  Input,
  IvyIcon,
  Separator,
  useDialogHotkeys,
  useHotkeys,
  vars,
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
import { useImportProjectsIntoWs, useWorkspace } from '~/data/workspace-api';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewInfoCard } from '~/neo/overview/OverviewInfoCard';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { useDownloadWorkspace } from '~/neo/workspace/useDownloadWorkspace';
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
      <Flex direction='row' gap={4} style={{ flexWrap: 'wrap' }}>
        <OverviewInfoCard
          title={t('neo.processes')}
          description={t('processes.processDescription')}
          icon={IvyIcons.Process}
          link='processes'
        />
        <OverviewInfoCard
          title={t('neo.dataClasses')}
          description={t('dataclasses.dataclassDescription')}
          icon={IvyIcons.Database}
          link='dataClasses'
        />
        <OverviewInfoCard title={t('neo.forms')} description={t('forms.formDescription')} icon={IvyIcons.File} link='forms' />
        <OverviewInfoCard
          title={t('neo.configs')}
          description={t('configurations.configDescription')}
          icon={IvyIcons.Tool}
          link='configurations'
        />
      </Flex>
      <Separator style={{ marginBlock: vars.size.s2, flex: '0 0 1px' }} />
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
          <Button title={t('workspaces.importProject')} icon={IvyIcons.Download} size='large' variant='primary' style={{ height: '32px' }}>
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
  const tags = useProjectTags(project, defaultProject);
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

const useProjectTags = (project: ProjectBean, defaultProject: boolean) => {
  const { t } = useTranslation();
  const tags = [];
  if (project.id.isIar) {
    tags.push(t('common.label.readOnly'));
  }
  if (defaultProject) {
    tags.push(t('common.label.default'));
  }
  return tags;
};
