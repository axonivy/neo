import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  IvyIcon,
  toast,
  useTheme,
  type Theme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useKnownHotkeys } from '~/utils/hotkeys';
const themes = ['light', 'dark', 'system'] as const;

export const useCycleTheme = () => {
  const { theme, setTheme } = useTheme();
  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    toast.info(`Theme: ${nextTheme}`);
  };
  return cycleTheme;
};

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  const { changeTheme } = useKnownHotkeys();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger aria-label={changeTheme.label} title={changeTheme.label} data-theme={theme}>
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
