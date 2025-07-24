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
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useKnownHotkeys } from '~/utils/hotkeys';
import cardStyles from './ArtifactCard.css?url';
import { ArtifactTag } from './ArtifactTag';
import { DeleteConfirmDialog, type DeleteAction } from './DeleteConfirmDialog';

export const cardStylesLink = { rel: 'stylesheet', href: cardStyles };

type Card = {
  name: string;
  onClick: () => void;
  preview: ReactNode;
  tooltip?: string;
  tagLabel?: string;
  deleteAction?: DeleteAction;
} & React.ComponentProps<'div'>;

export const ArtifactCard = ({ name, preview, onClick, deleteAction, tooltip, tagLabel, ref, children }: Card) => {
  const hotkeys = useKnownHotkeys();
  const { open, onOpenChange } = useDialogHotkeys(['artifactCardActionDialog']);
  const artifactCardRef = useHotkeys([hotkeys.deleteElement.hotkey], () => onOpenChange(true), { keydown: false, keyup: true });

  return (
    <div className='artifact-card' ref={ref}>
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
                </Flex>
              </Flex>
            </button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
      <div className='card-menu-trigger'>
        {deleteAction ? (
          <ArtifactCardMenu deleteAction={deleteAction} onDeleteDialogOpenChange={onOpenChange} isDeleteDialogOpen={open}>
            {children}
          </ArtifactCardMenu>
        ) : (
          <IvyIcon icon={IvyIcons.ArrowRight} />
        )}
      </div>
    </div>
  );
};

const ArtifactCardMenu = ({
  deleteAction,
  onDeleteDialogOpenChange,
  isDeleteDialogOpen,
  children
}: {
  deleteAction: DeleteAction;
  onDeleteDialogOpenChange: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={IvyIcons.Dots} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='card-menu'>
          <DropdownMenuGroup>
            <DropdownMenuItem className='card-delete' onSelect={() => onDeleteDialogOpenChange(true)}>
              <IvyIcon icon={IvyIcons.Trash} />
              <span>{deleteAction.label ?? t('common.label.delete')}</span>
            </DropdownMenuItem>
            {children}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {isDeleteDialogOpen && (
        <DeleteConfirmDialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange} deleteAction={deleteAction} />
      )}
    </>
  );
};
