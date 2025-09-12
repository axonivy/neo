import { toast } from '@axonivy/ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnimationSettings } from '~/data/neo-jsonrpc';
import type { NeoClient } from '~/data/neo-protocol';
import { useStopBpmEngine } from '~/data/project-api';

const animationFollowModes = ['all', 'currentProcess', 'openProcesses', 'noDialogProcesses', 'noEmbeddedProcesses'] as const;
export type AnimationFollowMode = (typeof animationFollowModes)[number];

export const speedModes = [
  { value: 0, label: 'fastest' },
  { value: 25, label: 'fast' },
  { value: 50, label: 'normal' },
  { value: 75, label: 'slow' },
  { value: 100, label: 'slowest' }
] as const;

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

export const useCycleAnimationSettings = () => {
  const { t } = useTranslation();
  const { animation, enableAnimation, animationMode, animationSpeed } = useSettings();
  const { app, pmv } = useParams();
  const { stopBpmEngine } = useStopBpmEngine();

  const cycleAnimationMode = () => {
    const currentIndex = animationFollowModes.indexOf(animation.mode);
    const nextMode = animationFollowModes[(currentIndex + 1) % animationFollowModes.length] ?? animationFollowModes[0];
    animationMode(nextMode);
    toast.info(t('toast.animation.mode', { mode: nextMode }));
  };

  const cycleAnimationSpeed = () => {
    const currentIndex = speedModes.findIndex(s => s.value === animation.speed);
    const nextSpeed = speedModes[(currentIndex + 1) % speedModes.length] ?? speedModes[0];

    animationSpeed(nextSpeed.value.toString());
    toast.info(t('toast.animation.speed', { speed: nextSpeed.label }));
  };
  const toggleAnimation = () => {
    enableAnimation(!animation.animate);
    toast.info(animation.animate ? t('toast.animation.disabled') : t('toast.animation.enabled'));
  };
  const resetEngine = () => {
    if (app && pmv) stopBpmEngine({ app, pmv });
  };
  return { cycleAnimationMode, cycleAnimationSpeed, toggleAnimation, resetEngine };
};
