import type { Disposable } from '@axonivy/jsonrpc';
import { AnimationSettings } from './neo-jsonrpc';
import { Process } from './process-api';

export class Callback<T, R = void> implements Disposable {
  private callback?: (e: T) => R;

  set(callback: (e: T) => R) {
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
  onOpenEditor: Callback<Process, boolean>;
  animationSettings(settings: AnimationSettings): void;
}
