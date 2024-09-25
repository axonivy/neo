import { StartProcessAction } from '@axonivy/process-editor-protocol';
import { Action, IActionHandler, NavigateToExternalTargetAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class ForwardActionsToNewActionHandler implements IActionHandler {
  handle(action: Action): void {
    if (NavigateToExternalTargetAction.is(action) || StartProcessAction.is(action)) {
      window.parent.postMessage(JSON.stringify(action));
    }
  }
}
