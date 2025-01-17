import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnimationSettings } from '~/data/neo-jsonrpc';
import type { NeoClient } from '~/data/neo-protocol';

export type AnimationFollowMode = 'all' | 'currentProcess' | 'openProcesses' | 'noDialogProcesses' | 'noEmbeddedProcesses';

type SettingsState = {
  animation: AnimationSettings;
  enableAnimation: (enable: boolean) => void;
  animationSpeed: (speed: string) => void;
  animationMode: (mode: AnimationFollowMode) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    set => ({
      animation: { animate: true, speed: 50, mode: 'all' },
      enableAnimation: enable => set(state => ({ animation: { ...state.animation, animate: enable } })),
      animationSpeed: speed => set(state => ({ animation: { ...state.animation, speed: parseInt(speed) } })),
      animationMode: mode => set(state => ({ animation: { ...state.animation, mode } }))
    }),
    { name: 'neo-settings', version: 2 }
  )
);

export const useSyncSettings = (client?: NeoClient) => {
  const { animation } = useSettings();
  useEffect(() => {
    client?.animationSettings(animation);
  }, [animation, client]);
};
