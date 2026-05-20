import { toast } from '@axonivy/ui-components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { noUnknownAction } from '~/utils/no-unknown';
import type { WebserviceActionHandler } from './webservice-client';

export const useActionHandler = () => {
  const { t } = useTranslation();
  const openUrl = useOpenUrl();
  return useCallback<WebserviceActionHandler>(
    action => {
      switch (action.actionId) {
        case 'openUrl':
          openUrl(action.payload as string);
          return;
        case 'generateCxfClient':
          toast.warning(t('message.unsupportedAction', { action: action.actionId }));
          return;
        default:
          noUnknownAction(action.actionId);
      }
    },
    [openUrl, t]
  );
};
