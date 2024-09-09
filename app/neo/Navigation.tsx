import { Button, Flex, Separator } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { NavLink } from '@remix-run/react';
import { SettingsMenu } from './settings/SettingsMenu';

export const Navigation = () => (
  <Flex
    direction='column'
    alignItems='center'
    justifyContent='space-between'
    style={{ paddingBlock: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)', flex: '0 0 50px' }}
    role='navigation'
  >
    <Flex direction='column' gap={4}>
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
      <Separator />
      <NavLink to='market' prefetch='intent' style={{ all: 'unset' }} aria-label='Market' title='Market'>
        {({ isActive }) => <Button icon={IvyIcons.Market} size='large' toggle={isActive} />}
      </NavLink>
    </Flex>
    <SettingsMenu />
  </Flex>
);
