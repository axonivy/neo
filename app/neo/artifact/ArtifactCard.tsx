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
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { ArtifactTag } from './ArtifactTag';
import cardStyles from './card.css?url';
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
  const { deleteElement } = useKnownHotkeys();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const artifactCardRef = useHotkeys(deleteElement.hotkey, () => {
    setDeleteDialogOpen(true);
  });

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
                    setDeleteDialogOpen(true);
                  }}
                >
                  <IvyIcon icon={IvyIcons.Trash} />
                  <span>{actions.delete.label ?? 'Delete'}</span>
                </DropdownMenuItem>
              )}
              {actions.export && actions.deploy && (
                <>
                  <DropdownMenuItem onSelect={actions.export}>
                    <IvyIcon icon={IvyIcons.Upload} />
                    <span>Export</span>
                  </DropdownMenuItem>
                  <DeployDialog deployAction={actions.deploy}>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      <IvyIcon icon={IvyIcons.Bpmn} />
                      <span>Deploy</span>
                    </DropdownMenuItem>
                  </DeployDialog>
                </>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {actions?.delete && isDeleteDialogOpen && (
        <DeleteConfirm open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen} title={type} deleteAction={actions.delete} />
      )}
    </div>
  );
};

export const NewArtifactCard = ({ title, open, menu }: { title: string; open: () => void; menu?: ReactNode }) => {
  const { addElement } = useKnownHotkeys(title);
  useHotkeys(addElement.hotkey, open, { keydown: false, keyup: true });
  return (
    <div className='artifact-card new-artifact-card'>
      <button className='card' onClick={open} title={addElement.label} aria-label={addElement.label}>
        <Flex direction='column' justifyContent='space-between' gap={2} className='card-content'>
          <Flex alignItems='center' justifyContent='center' className='card-preview'></Flex>
          <Flex alignItems='center' justifyContent='space-between' gap={1}>
            <span className='card-name'>{title}</span>
            {!menu && <IvyIcon icon={IvyIcons.Plus} />}
          </Flex>
        </Flex>
      </button>
      {menu}
    </div>
  );
};
