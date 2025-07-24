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
import { useState, type ReactNode, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { useKnownHotkeys } from '~/utils/hotkeys';
import cardStyles from './ArtifactCard.css?url';
import { ArtifactTag } from './ArtifactTag';
import { DeleteConfirm, type DeleteAction } from './DeleteConfirm';

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
  };
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
};

export const ArtifactCard = ({ name, type, preview, onClick, actions, tooltip, tagLabel, ref, children }: Card) => {
  const hotkeys = useKnownHotkeys();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['artifactCardActionDialog']);
  const onDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };
  const artifactCardRef = useHotkeys([hotkeys.deleteElement.hotkey], () => onDeleteDialogOpenChange(true), { keydown: false, keyup: true });

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
                  {!actions && <IvyIcon icon={IvyIcons.ArrowRight} />}
                </Flex>
              </Flex>
            </button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
      <ArtifactCardMenu
        actions={actions}
        onDeleteDialogOpenChange={onDeleteDialogOpenChange}
        isDeleteDialogOpen={isDeleteDialogOpen}
        type={type}
      >
        {children}
      </ArtifactCardMenu>
    </div>
  );
};

const ArtifactCardMenu = ({
  actions,
  onDeleteDialogOpenChange,
  isDeleteDialogOpen,
  type,
  children
}: {
  actions?: {
    delete?: DeleteAction;
  };
  onDeleteDialogOpenChange: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  type: string;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();
  if (!actions) {
    return null;
  }
  return (
    <>
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
            {children}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {actions?.delete && isDeleteDialogOpen && (
        <DeleteConfirm open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange} title={type} deleteAction={actions.delete} />
      )}
    </>
  );
};
