import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  IvyIcon
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export const LanguageSettings = () => {
  const { t } = useTranslation();
  const languages = Object.keys(i18next.services.resourceStore.data);
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger aria-label={t('settings.languageSwitch')}>
        <IvyIcon icon={IvyIcons.Language} />
        <span>{t('settings.language')}</span>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={i18next.resolvedLanguage} onValueChange={i18next.changeLanguage}>
              {languages.map(language => (
                <DropdownMenuRadioItem key={language} value={language}>
                  {new Intl.DisplayNames([language], { type: 'language' }).of(language)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSubTrigger>
    </DropdownMenuSub>
  );
};
