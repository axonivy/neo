import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';
import { SetDirtyStateAction } from '@eclipse-glsp/protocol';
import { SetDirtyStateActionHandler } from './action-handler';

const ivyAutoSaveModule = new FeatureModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, SetDirtyStateAction.KIND, SetDirtyStateActionHandler);
});

export default ivyAutoSaveModule;
