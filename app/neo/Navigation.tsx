import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useNavigate, NavLink } from '@remix-run/react';
import { SettingsMenu } from './settings/SettingsMenu';

export const Navigation = () => {
  const navigate = useNavigate();
  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='space-between'
      style={{ paddingBlock: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)', flex: '0 0 50px' }}
    >
      <Flex direction='column' gap={4}>
        <NavLink to='/processes' prefetch='intent' style={{ all: 'unset' }}>
          {({ isActive }) => <Button title='Processes' icon={IvyIcons.Process} size='large' toggle={isActive} />}
        </NavLink>
        <Button icon={IvyIcons.Database} size='large' onClick={() => navigate('processes')} />
        <NavLink to='/forms' prefetch='intent' style={{ all: 'unset' }}>
          {({ isActive }) => <Button title='Forms' icon={IvyIcons.File} size='large' toggle={isActive} />}
        </NavLink>
        <Button icon={IvyIcons.Tool} size='large' onClick={() => navigate('processes')} />
      </Flex>
      <SettingsMenu />
    </Flex>
  );
};
