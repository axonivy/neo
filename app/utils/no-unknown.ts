import { toast } from '@axonivy/ui-components';

export const noUnknownAction = (action: never) => {
  toast.error(`Unknown action: ${action}`);
};

export const noUnknownType = (type: never) => {
  toast.error(`Unknown type: ${type}`);
};
