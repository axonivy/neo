import { TYPES, type IActionDispatcher, type IActionHandler } from '@eclipse-glsp/client';
import { SaveModelAction, SetDirtyStateAction } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

@injectable()
export class SetDirtyStateActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected dispatcher!: IActionDispatcher;

  handle(action: SetDirtyStateAction): void {
    if (action.isDirty) {
      this.dispatcher.dispatch(SaveModelAction.create());
    }
  }
}
