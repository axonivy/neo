import { Action, GModelElement, InvokeCopyPasteAction, KeyListener, matchesKeystroke } from '@eclipse-glsp/client';

export class CopyPasteKeyListener extends KeyListener {
  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyC', 'ctrlCmd')) {
      return [InvokeCopyPasteAction.create('copy')];
    }
    if (matchesKeystroke(event, 'KeyV', 'ctrlCmd')) {
      return [InvokeCopyPasteAction.create('paste')];
    }
    if (matchesKeystroke(event, 'KeyX', 'ctrlCmd')) {
      return [InvokeCopyPasteAction.create('cut')];
    }
    return [];
  }
}
