import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  IvyIcon,
  useTheme,
  type Theme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger aria-label='Theme switch' data-theme={theme}>
        <IvyIcon icon={IvyIcons.DarkMode} />
        <span>Theme</span>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={theme} onValueChange={mode => setTheme(mode as Theme)}>
              <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='system'>System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSubTrigger>
    </DropdownMenuSub>
  );
};
