import type { Disposable } from '@axonivy/jsonrpc';
import type { Form } from './form-api';
import type { AnimationSettings } from './neo-jsonrpc';
import type { Process } from './process-api';

export class Callback<T, R = void> implements Disposable {
  private callback?: (e: T) => Promise<R>;

  set(callback: (e: T) => Promise<R>) {
    this.callback = callback;
  }

  call(e: T) {
    return this.callback?.(e);
  }

  dispose() {
    this.callback = undefined;
  }
}

export interface NeoClient {
  onOpenProcessEditor: Callback<Process, boolean>;
  onOpenFormEditor: Callback<Form, boolean>;
  animationSettings(settings: AnimationSettings): void;

  stop(): void;
}
