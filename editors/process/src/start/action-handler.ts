import { injectable } from 'inversify';
import { IActionHandler } from '@eclipse-glsp/client';
import { StartProcessAction } from '@axonivy/process-editor-protocol';

@injectable()
export class StartProcessActionHandler implements IActionHandler {
  handle(action: StartProcessAction) {
    window.parent.postMessage(JSON.stringify(action));
  }
}
