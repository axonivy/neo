import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  IvyIcon
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { LinksFunction } from '@remix-run/node';
import cardStyles from './card.css?url';
import { DeleteConfirm } from './DeleteConfirm';
import { ReactNode } from 'react';

export const cardLinks: LinksFunction = () => [{ rel: 'stylesheet', href: cardStyles }];

type Card = { name: string; type: string; preview: ReactNode; onClick: () => void; actions?: { delete?: () => void } };

export const ArtifactCard = ({ name, type, preview, onClick, actions }: Card) => (
  <div className='artifact-card'>
    <button className='card' onClick={onClick}>
      <Flex direction='column' justifyContent='space-between' gap={2} className='card-content'>
        <Flex alignItems='center' justifyContent='center' className='card-preview' tabIndex={-1}>
          {preview}
        </Flex>
        <Flex alignItems='center' justifyContent='space-between' gap={1}>
          <span className='card-name'>{name}</span>
          {!actions && <IvyIcon icon={IvyIcons.ArrowRight} />}
        </Flex>
      </Flex>
    </button>
    {actions && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={IvyIcons.Dots} className='card-menu-trigger' />
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='card-menu'>
          <DropdownMenuGroup>
            <DeleteConfirm title={type} deleteAction={actions.delete!}>
              <DropdownMenuItem className='card-delete' onSelect={e => e.preventDefault()}>
                <IvyIcon icon={IvyIcons.Trash} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteConfirm>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  </div>
);
