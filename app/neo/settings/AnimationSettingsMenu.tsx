import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  IvyIcon
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useStopBpmEngine } from '~/data/project-api';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { speedModes, useSettings, type AnimationFollowMode } from './useSettings';

export const AnimationSettingsMenu = () => {
  const { t } = useTranslation('neo', { keyPrefix: 'animation' });
  const { animation, enableAnimation, animationSpeed, animationMode } = useSettings();
  const { stopBpmEngine } = useStopBpmEngine();
  const { app, pmv } = useParams();
  const hotkeys = useKnownHotkeys();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>{t('animation')}</DropdownMenuLabel>
      <DropdownMenuCheckboxItem
        checked={animation.animate}
        onCheckedChange={enableAnimation}
        aria-label={hotkeys.toggleAnimation.label}
        title={hotkeys.toggleAnimation.label}
      >
        {t('enabled')}
      </DropdownMenuCheckboxItem>
      <DropdownMenuItem
        disabled={!app || !pmv}
        onClick={e => {
          e.preventDefault();
          if (app && pmv) stopBpmEngine({ app, pmv });
        }}
        aria-label={hotkeys.resetEngine.label}
        title={hotkeys.resetEngine.label}
      >
        <IvyIcon icon={IvyIcons.Undo} />
        {t('reset')}
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger aria-label={hotkeys.animationSpeed.label} title={hotkeys.animationSpeed.label}>
          <IvyIcon icon={IvyIcons.Clock} />
          <span>{t('speed')}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={animation.speed.toString()} onValueChange={animationSpeed}>
              {speedModes.map(({ value, label }) => (
                <DropdownMenuRadioItem key={value} value={value.toString()} aria-label={label}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger aria-label={hotkeys.animationMode.label} title={hotkeys.animationMode.label}>
          <IvyIcon icon={IvyIcons.Process} />
          <span>{t('mode')}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={animation.mode} onValueChange={mode => animationMode(mode as AnimationFollowMode)}>
              <DropdownMenuRadioItem value='all'>{t('allProcesses')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='currentProcess'>{t('onlyCurrenltyOpen')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='openProcesses'>{t('allOpen')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='noDialogProcesses'>{t('noDialog')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='noEmbeddedProcesses'>{t('noEmbedded')}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};
