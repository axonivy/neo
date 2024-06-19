import {
  Button,
  Flex,
  IvyIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Separator,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useNavigate, NavLink } from '@remix-run/react';

export const Navigation = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
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
      <Popover>
        <PopoverTrigger asChild>
          <Button icon={IvyIcons.Settings} size='large' />
        </PopoverTrigger>
        <PopoverContent sideOffset={6} collisionPadding={10} side='right' style={{ border: 'var(--basic-border)' }}>
          <ReadonlyProvider readonly={false}>
            <Flex direction='column'>
              <Flex alignItems='center' gap={1}>
                <IvyIcon icon={IvyIcons.User} />
                Developer
              </Flex>
              <Separator />
              <Flex
                alignItems='center'
                gap={1}
                style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
              >
                <IvyIcon icon={IvyIcons.DarkMode} />
                {theme}
              </Flex>
            </Flex>
          </ReadonlyProvider>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
