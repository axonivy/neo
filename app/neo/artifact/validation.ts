import type { MessageData } from '@axonivy/ui-components';

export const validateNotEmpty = (value: string, label: string, type?: string): MessageData | undefined => {
  if (value) {
    return;
  }
  return { message: `Please define a ${label} for the new ${type}.`, variant: 'warning' };
};
