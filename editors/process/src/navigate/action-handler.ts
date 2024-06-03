import { injectable } from 'inversify';
import { Action, IActionHandler, NavigateToExternalTargetAction } from '@eclipse-glsp/client';

@injectable()
export class NavigateToExternalTargetActionHandler implements IActionHandler {
  handle(action: Action): void {
    if (NavigateToExternalTargetAction.is(action)) {
      window.parent.postMessage(JSON.stringify(action.target));
    }
  }
}
