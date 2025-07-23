import { SmartNeoClient } from '@axonivy/smart-neo-client';
import { ThemeProvider } from '@axonivy/ui-components';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

export const SmartNeo = () => {
  return (
    <ThemeProvider disabled>
      <I18nextProvider i18n={i18next} defaultNS={'smart-neo-client'}>
        <SmartNeoClient />
      </I18nextProvider>
    </ThemeProvider>
  );
};
