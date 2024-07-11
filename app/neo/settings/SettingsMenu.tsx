import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  IvyIcon,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { AnimationFollowMode, useSettings } from './useSettings';

export const SettingsMenu = () => {
  const { theme, setTheme } = useTheme();
  const { animation, enableAnimation, animationSpeed, animationMode } = useSettings();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={IvyIcons.Settings} size='large' aria-label='Settings' title='Settings' />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={6} collisionPadding={10} side='right'>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IvyIcon icon={IvyIcons.User} />
            Developer
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Animation</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={animation.animate} onCheckedChange={enableAnimation} aria-label='Toggle animation'>
            Enabled
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger aria-label='Animation speed'>
              <IvyIcon icon={IvyIcons.Clock} />
              <span>Speed</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={animation.speed.toString()} onValueChange={animationSpeed}>
                  <DropdownMenuRadioItem value='0' aria-label='0'>
                    0
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='25' aria-label='25'>
                    25
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='50' aria-label='50'>
                    50
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='75' aria-label='75'>
                    75
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='100' aria-label='100'>
                    100
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IvyIcon icon={IvyIcons.Process} />
              <span>Mode</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={animation.mode} onValueChange={mode => animationMode(mode as AnimationFollowMode)}>
                  <DropdownMenuRadioItem value='all'>All processes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='currentProcess'>Only current open process</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='openProcesses'>All open processes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='noDialogProcesses'>No dialog processes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='noEmbeddedProcesses'>No embedded processes</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
          style={{ textTransform: 'capitalize' }}
          aria-label='Theme switch'
          data-state={theme}
        >
          <IvyIcon icon={IvyIcons.DarkMode} />
          {theme}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
