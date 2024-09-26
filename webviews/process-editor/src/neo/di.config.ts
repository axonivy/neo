import { IVY_TYPES, StarProcessQuickActionProvider } from '@axonivy/process-editor';
import { StartProcessAction } from '@axonivy/process-editor-protocol';
import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol';
import { ForwardActionsToNewActionHandler } from './action-handler';

const ivyNeoModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(StarProcessQuickActionProvider);
  configureActionHandler({ bind, isBound }, NavigateToExternalTargetAction.KIND, ForwardActionsToNewActionHandler);
  configureActionHandler({ bind, isBound }, StartProcessAction.KIND, ForwardActionsToNewActionHandler);
});

export default ivyNeoModule;
