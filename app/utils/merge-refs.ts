import { useMemo, type Ref, type RefCallback } from 'react';

export function assignRef<T>(ref: Ref<T> | undefined | null, value: T | null): ReturnType<RefCallback<T>> {
  if (typeof ref === 'function') {
    return ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export function mergeRefs<T>(refs: (Ref<T> | undefined)[]): Ref<T> {
  return (value: T | null) => {
    const cleanups: (() => void)[] = [];

    for (const ref of refs) {
      const cleanup = assignRef(ref, value);
      const isCleanup = typeof cleanup === 'function';
      cleanups.push(isCleanup ? cleanup : () => assignRef(ref, null));
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  };
}

export function useMergeRefs<T>(refs: (Ref<T> | undefined)[]): Ref<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => mergeRefs(refs), refs);
}
