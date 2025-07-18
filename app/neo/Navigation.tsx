import { Button, Flex, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { LanguageSettings } from '~/neo/settings/LanguageSettings';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { useNeoClient } from './client/useNeoClient';
import { AnimationSettings } from './settings/AnimationSettings';
import { Settings } from './settings/Settings';
import { ThemeSettings } from './settings/ThemeSettings';
import { useCycleAnimationSettings } from './settings/useSettings';

export const Navigation = () => {
  useNeoClient();
  const { cycleAnimationMode, cycleAnimationSpeed, toggleAnimation, resetEngine } = useCycleAnimationSettings();
  const navigate = useNavigate();
  const hotkeys = useKnownHotkeys();
  const workspacesElement = useRef<HTMLButtonElement>(null);
  useHotkeys(hotkeys.focusNav.hotkey, () => workspacesElement.current?.focus(), { enableOnFormTags: true, scopes: ['neo'] });
  useHotkeys(hotkeys.openWorkspaces.hotkey, () => navigate(''), { enableOnFormTags: true, scopes: ['neo'] });
  useHotkeys(hotkeys.openProcesses.hotkey, () => navigate('processes'), { enableOnFormTags: true, scopes: ['neo'] });
  useHotkeys(hotkeys.openForms.hotkey, () => navigate('forms'), { enableOnFormTags: true, scopes: ['neo'] });
  useHotkeys(hotkeys.openDataClasses.hotkey, () => navigate('dataclasses'), { enableOnFormTags: true, scopes: ['neo'] });
  useHotkeys(hotkeys.openConfigs.hotkey, () => navigate('configurations'), { enableOnFormTags: true, scopes: ['neo'] });
  useHotkeys(hotkeys.toggleAnimation.hotkey, toggleAnimation, { scopes: ['neo'] });
  useHotkeys(hotkeys.animationSpeed.hotkey, cycleAnimationSpeed, { scopes: ['neo'] });
  useHotkeys(hotkeys.animationMode.hotkey, cycleAnimationMode, { scopes: ['neo'] });
  useHotkeys(hotkeys.resetEngine.hotkey, resetEngine, { scopes: ['neo'] });

  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='space-between'
      style={{ paddingBlock: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)', flex: '0 0 50px' }}
      role='navigation'
      className='neo-navigation'
    >
      <Flex direction='column' gap={4}>
        <NavLink
          to=''
          prefetch='intent'
          style={{ all: 'unset' }}
          aria-label={hotkeys.openWorkspaces.label}
          title={hotkeys.openWorkspaces.label}
          tabIndex={-1}
          end
        >
          {({ isActive }) => <Button icon={IvyIcons.Home} size='large' toggle={isActive} ref={workspacesElement} />}
        </NavLink>
        <NavLink
          to='processes'
          prefetch='intent'
          style={{ all: 'unset' }}
          aria-label={hotkeys.openProcesses.label}
          title={hotkeys.openProcesses.label}
          tabIndex={-1}
        >
          {({ isActive }) => <Button icon={IvyIcons.Process} size='large' toggle={isActive} />}
        </NavLink>
        <NavLink
          to='dataclasses'
          prefetch='intent'
          style={{ all: 'unset' }}
          aria-label={hotkeys.openDataClasses.label}
          title={hotkeys.openDataClasses.label}
          tabIndex={-1}
        >
          {({ isActive }) => <Button icon={IvyIcons.Database} size='large' toggle={isActive} />}
        </NavLink>
        <NavLink
          to='forms'
          prefetch='intent'
          style={{ all: 'unset' }}
          aria-label={hotkeys.openForms.label}
          title={hotkeys.openForms.label}
          tabIndex={-1}
        >
          {({ isActive }) => <Button icon={IvyIcons.File} size='large' toggle={isActive} />}
        </NavLink>
        <NavLink
          to='configurations'
          prefetch='intent'
          style={{ all: 'unset' }}
          aria-label={hotkeys.openConfigs.label}
          title={hotkeys.openConfigs.label}
          tabIndex={-1}
        >
          {({ isActive }) => <Button icon={IvyIcons.Tool} size='large' toggle={isActive} />}
        </NavLink>
      </Flex>
      <Settings side='right'>
        <AnimationSettings />
        <LanguageSettings />
        <ThemeSettings />
      </Settings>
    </Flex>
  );
};
