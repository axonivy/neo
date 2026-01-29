import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  hotkeyText,
  IvyIcon,
  toast,
  useTheme,
  type Theme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useKnownHotkeys } from '~/utils/hotkeys';
const themes = ['light', 'dark', 'system'] as const;

export const useCycleTheme = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length] ?? themes[0];
    setTheme(nextTheme);
    toast.info(`${t('settings.theme')}: ${nextTheme}`);
  };
  return cycleTheme;
};

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  const { changeTheme } = useKnownHotkeys();
  const { t } = useTranslation();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger aria-label={changeTheme.label} title={changeTheme.label} data-theme={theme}>
        <IvyIcon icon={IvyIcons.DarkMode} />
        <span>{t('settings.theme')}</span>
        <DropdownMenuShortcut>{hotkeyText(changeTheme.hotkey)}</DropdownMenuShortcut>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={theme} onValueChange={mode => setTheme(mode as Theme)}>
            <DropdownMenuRadioItem value='light'> {t('settings.light')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='dark'>{t('settings.dark')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='system'>{t('settings.system')}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
