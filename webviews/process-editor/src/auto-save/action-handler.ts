import { inject, injectable } from 'inversify';
import { IActionHandler, TYPES, IActionDispatcher } from '@eclipse-glsp/client';
import { SetDirtyStateAction, SaveModelAction } from '@eclipse-glsp/protocol';

@injectable()
export class SetDirtyStateActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected dispatcher: IActionDispatcher;
  handle(action: SetDirtyStateAction): void {
    if (action.isDirty) {
      this.dispatcher.dispatch(SaveModelAction.create());
    }
  }
}
