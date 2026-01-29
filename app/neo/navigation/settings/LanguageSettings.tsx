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
import { getKnownLanguages } from '~/translation/translation';

export const LanguageSettings = () => {
  const { t } = useTranslation();
  const languages = getKnownLanguages();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger aria-label={t('settings.languageSwitch')}>
        <IvyIcon icon={IvyIcons.Language} />
        <span>{t('settings.language')}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={i18next.resolvedLanguage}
            onValueChange={value => i18next.loadLanguages(value).then(() => i18next.changeLanguage(value))}
          >
            {languages.map(language => (
              <DropdownMenuRadioItem key={language} value={language}>
                {new Intl.DisplayNames([language], { type: 'language' }).of(language)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
