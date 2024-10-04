import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  IvyIcon,
  Separator
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavLink, useNavigate } from '@remix-run/react';
import { useImportProjects } from './artifact/useImportProjects';
import { SettingsMenu } from './settings/SettingsMenu';

export const Navigation = () => {
  const navigate = useNavigate();
  const fileImport = useImportProjects();
  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='space-between'
      style={{ paddingBlock: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)', flex: '0 0 50px' }}
      role='navigation'
    >
      <Flex direction='column' gap={4}>
        <NavLink to='' prefetch='intent' style={{ all: 'unset' }} aria-label='Application Home' title='Application Home' end>
          {({ isActive }) => <Button icon={IvyIcons.Home} size='large' toggle={isActive} />}
        </NavLink>
        <NavLink to='processes' prefetch='intent' style={{ all: 'unset' }} aria-label='Processes' title='Processes'>
          {({ isActive }) => <Button icon={IvyIcons.Process} size='large' toggle={isActive} />}
        </NavLink>
        <NavLink to='dataclasses' prefetch='intent' style={{ all: 'unset' }} aria-label='Data Classes' title='Data Classes'>
          {({ isActive }) => <Button icon={IvyIcons.Database} size='large' toggle={isActive} />}
        </NavLink>
        <NavLink to='forms' prefetch='intent' style={{ all: 'unset' }} aria-label='Forms' title='Forms'>
          {({ isActive }) => <Button icon={IvyIcons.File} size='large' toggle={isActive} />}
        </NavLink>
        <NavLink to='configurations' prefetch='intent' style={{ all: 'unset' }} aria-label='Configurations' title='Configurations'>
          {({ isActive }) => <Button icon={IvyIcons.Tool} size='large' toggle={isActive} />}
        </NavLink>
        <Separator style={{ marginBlock: '2px' }} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={IvyIcons.Dots} size='large' aria-label='Import' title='Import' />
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={6} collisionPadding={10} side='right'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={fileImport}>
                <IvyIcon icon={IvyIcons.Download} />
                File Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('market')}>
                <IvyIcon icon={IvyIcons.Market} />
                Market
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      <SettingsMenu />
    </Flex>
  );
};
