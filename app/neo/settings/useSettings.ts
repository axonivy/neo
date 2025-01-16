import { useCallback, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnimationSettings } from '~/data/neo-jsonrpc';
import { useNeoClient } from '~/neo/client/useNeoClient';

export type AnimationFollowMode = 'all' | 'currentProcess' | 'openProcesses' | 'noDialogProcesses' | 'noEmbeddedProcesses';

type SettingsState = {
  animation: AnimationSettings;
  enable: (enable: boolean) => void;
  speed: (speed: number) => void;
  mode: (mode: AnimationFollowMode) => void;
};

export const useStore = create<SettingsState>()(
  persist(
    set => ({
      animation: { animate: false, speed: 50, mode: 'all' },
      enable: enable => set(state => ({ animation: { ...state.animation, animate: enable } })),
      speed: speed => set(state => ({ animation: { ...state.animation, speed } })),
      mode: mode => set(state => ({ animation: { ...state.animation, mode } }))
    }),
    { name: 'neo-settings', version: 2 }
  )
);

export const useSettings = () => {
  const { animation, enable, speed, mode } = useStore();
  const client = useNeoClient(animation.mode);
  useEffect(() => {
    client?.animationSettings(animation);
  }, [animation, client]);
  const animationSpeed = useCallback((value: string) => speed(parseInt(value)), [speed]);
  return { animation, enableAnimation: enable, animationSpeed, animationMode: mode };
};
