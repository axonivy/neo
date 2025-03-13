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
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleContext } from '~/root';
import { getAvailableLanguages } from './translation';

export const LanguageSelector = () => {
  const { t } = useTranslation();
  const { locale, setLocale } = useContext(LocaleContext);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['loading...']);

  getAvailableLanguages().then(result => {
    setAvailableLanguages(result);
  });

  const updateLanguage = (lng: string) => {
    setLocale(lng);
    i18next.changeLanguage(lng);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger aria-label='Language switch'>
        <IvyIcon icon={IvyIcons.Cms} />
        <span>{t('language')}</span>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={locale} onValueChange={lng => updateLanguage(lng)}>
              {availableLanguages.map(language => (
                <DropdownMenuRadioItem key={language} value={language}>
                  {language}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSubTrigger>
    </DropdownMenuSub>
  );
};
