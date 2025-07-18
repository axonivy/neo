import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  IvyIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeyLocalScopes,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useKnownHotkeys } from '~/utils/hotkeys';
import cardStyles from './ArtifactCard.css?url';
import { ArtifactTag } from './ArtifactTag';
import { DeleteConfirm, type DeleteAction } from './DeleteConfirm';
import { DeployDialog, type DeployActionParams } from './DeployDialog';

export const cardStylesLink = { rel: 'stylesheet', href: cardStyles };

type Card = {
  name: string;
  type: string;
  preview?: ReactNode;
  tooltip?: string;
  tagLabel?: string;
  onClick: () => void;
  actions?: {
    delete?: DeleteAction;
    export?: () => void;
    deploy?: (params: DeployActionParams) => Promise<string>;
  };
};

export const ArtifactCard = ({ name, type, preview, onClick, actions, tooltip, tagLabel }: Card) => {
  const hotkeys = useKnownHotkeys();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeployDialogOpen, setDeployDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['artifactCardActionDialog']);
  const onDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };

  const onDeployDialogOpenChange = (open: boolean) => {
    setDeployDialogOpen(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };
  const artifactCardRef = useHotkeys(
    [hotkeys.deleteElement.hotkey, hotkeys.exportWorkspace.hotkey, hotkeys.deployWorkspace.hotkey],
    (_, { hotkey }) => {
      switch (hotkey) {
        case hotkeys.deleteElement.hotkey:
          onDeleteDialogOpenChange(true);
          break;
        case hotkeys.deployWorkspace.hotkey:
          if (actions && actions.export && actions.deploy) {
            onDeployDialogOpenChange(true);
          }
          break;
        case hotkeys.exportWorkspace.hotkey:
          if (actions && actions.export && actions.deploy) {
            actions.export();
          }
          break;
      }
    },
    { keydown: false, keyup: true }
  );

  return (
    <div className='artifact-card'>
      <TooltipProvider>
        <Tooltip delayDuration={700}>
          {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
          <TooltipTrigger asChild>
            <button className='card normal-card' onClick={onClick} ref={artifactCardRef}>
              <Flex direction='column' justifyContent='space-between' gap={2} className='card-content'>
                <Flex alignItems='center' justifyContent='center' className='card-preview'>
                  {tagLabel && (
                    <div style={{ position: 'absolute', top: 15, right: 15 }}>
                      <ArtifactTag label={tagLabel} />
                    </div>
                  )}
                  {preview}
                </Flex>
                <Flex alignItems='center' justifyContent='space-between' gap={1}>
                  <span className='card-name'>{name}</span>
                  {!actions && <IvyIcon icon={IvyIcons.ArrowRight} />}
                </Flex>
              </Flex>
            </button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
      {actions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={IvyIcons.Dots} className='card-menu-trigger' />
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start' className='card-menu'>
            <DropdownMenuGroup>
              {actions.delete && (
                <DropdownMenuItem
                  className='card-delete'
                  onSelect={e => {
                    e.preventDefault();
                    onDeleteDialogOpenChange(true);
                  }}
                >
                  <IvyIcon icon={IvyIcons.Trash} />
                  <span>{actions.delete.label ?? t('common.label.delete')}</span>
                </DropdownMenuItem>
              )}
              {actions.export && actions.deploy && (
                <>
                  <DropdownMenuItem
                    onSelect={actions.export}
                    title={hotkeys.exportWorkspace.label}
                    aria-label={hotkeys.exportWorkspace.label}
                  >
                    <IvyIcon icon={IvyIcons.Upload} />
                    <span>{t('common.label.export')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={e => {
                      e.preventDefault();
                      onDeployDialogOpenChange(true);
                    }}
                    title={hotkeys.deployWorkspace.label}
                    aria-label={hotkeys.deployWorkspace.label}
                  >
                    <IvyIcon icon={IvyIcons.Bpmn} />
                    <span>{t('common.label.deploy')}</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {actions?.delete && isDeleteDialogOpen && (
        <DeleteConfirm open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange} title={type} deleteAction={actions.delete} />
      )}
      {actions?.export && actions?.deploy && isDeployDialogOpen && (
        <DeployDialog open={isDeployDialogOpen} onOpenChange={onDeployDialogOpenChange} deployAction={actions.deploy} />
      )}
    </div>
  );
};
