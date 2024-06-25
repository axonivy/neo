import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnimationSettings } from '~/data/neo-jsonrpc';
import { useNeoClient } from '../client/useNeoClient';
import { useCallback, useEffect } from 'react';

type SettingsState = {
  animation: AnimationSettings;
  enable: (enable: boolean) => void;
  speed: (speed: number) => void;
};

const useStore = create<SettingsState>()(
  persist(
    set => ({
      animation: { animate: false, speed: 50 },
      enable: enable => set(state => ({ animation: { ...state.animation, animate: enable } })),
      speed: speed => set(state => ({ animation: { ...state.animation, speed: speed } }))
    }),
    { name: 'neo-settings', version: 1 }
  )
);

export const useSettings = () => {
  const { animation, enable, speed } = useStore();
  const client = useNeoClient();
  useEffect(() => {
    client.animationSettings(animation);
  }, [animation, client]);
  const animationSpeed = useCallback((value: string) => speed(parseInt(value)), [speed]);
  return { animation, enableAnimation: enable, animationSpeed };
};
