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
import { useSettings } from './useSettings';

export const SettingsMenu = () => {
  const { theme, setTheme } = useTheme();
  const { animation, enableAnimation, animationSpeed } = useSettings();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={IvyIcons.Settings} size='large' />
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
          <DropdownMenuCheckboxItem checked={animation.animate} onCheckedChange={enableAnimation}>
            Enable
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IvyIcon icon={IvyIcons.Clock} />
              <span>Speed</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={animation.speed.toString()} onValueChange={animationSpeed}>
                  <DropdownMenuRadioItem value='0'>0</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='25'>25</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='50'>50</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='75'>75</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='100'>100</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
          style={{ textTransform: 'capitalize' }}
        >
          <IvyIcon icon={IvyIcons.DarkMode} />
          {theme}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
