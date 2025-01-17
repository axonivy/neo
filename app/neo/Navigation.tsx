import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavLink } from 'react-router';
import { useNeoClient } from './client/useNeoClient';
import { AnimationSettingsMenu } from './settings/AnimationSettingsMenu';
import { ThemeSettings } from './settings/ThemeSettings';

export const Navigation = () => {
  useNeoClient();
  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='space-between'
      style={{ paddingBlock: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)', flex: '0 0 50px' }}
      role='navigation'
    >
      <Flex direction='column' gap={4}>
        <NavLink to='' prefetch='intent' style={{ all: 'unset' }} aria-label='Workspace' title='Workspace' end>
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
      </Flex>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={IvyIcons.Settings} size='large' aria-label='Settings' title='Settings' />
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={6} collisionPadding={10} side='right'>
          <AnimationSettingsMenu />
          <DropdownMenuSeparator />
          <ThemeSettings />
        </DropdownMenuContent>
      </DropdownMenu>
    </Flex>
  );
};
