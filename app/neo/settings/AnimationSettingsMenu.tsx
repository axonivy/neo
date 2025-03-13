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
  const { t } = useTranslation();
  const { animation, enableAnimation, animationSpeed, animationMode } = useSettings();
  const { stopBpmEngine } = useStopBpmEngine();
  const { app, pmv } = useParams();
  const hotkeys = useKnownHotkeys();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>{t('animation.animation')}</DropdownMenuLabel>
      <DropdownMenuCheckboxItem
        checked={animation.animate}
        onCheckedChange={enableAnimation}
        aria-label={hotkeys.toggleAnimation.label}
        title={hotkeys.toggleAnimation.label}
      >
        {t('animation.enabled')}
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
        {t('animation.reset')}
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger aria-label={hotkeys.animationSpeed.label} title={hotkeys.animationSpeed.label}>
          <IvyIcon icon={IvyIcons.Clock} />
          <span>{t('animation.speed')}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={animation.speed.toString()} onValueChange={animationSpeed}>
              <DropdownMenuRadioItem key={speedModes[0].value} value={speedModes[0].value.toString()} aria-label={t('animation.fastest')}>
                {t('animation.fastest')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem key={speedModes[1].value} value={speedModes[1].value.toString()} aria-label={t('animation.fast')}>
                {t('animation.fast')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem key={speedModes[2].value} value={speedModes[2].value.toString()} aria-label={t('animation.normal')}>
                {t('animation.normal')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem key={speedModes[3].value} value={speedModes[3].value.toString()} aria-label={t('animation.slow')}>
                {t('animation.slow')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem key={speedModes[4].value} value={speedModes[4].value.toString()} aria-label={t('animation.slowest')}>
                {t('animation.slowest')}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger aria-label={hotkeys.animationMode.label} title={hotkeys.animationMode.label}>
          <IvyIcon icon={IvyIcons.Process} />
          <span>{t('animation.mode')}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={animation.mode} onValueChange={mode => animationMode(mode as AnimationFollowMode)}>
              <DropdownMenuRadioItem value='all'>{t('animation.allProcesses')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='currentProcess'>{t('animation.onlyCurrenltyOpen')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='openProcesses'>{t('animation.allOpen')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='noDialogProcesses'>{t('animation.noDialog')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='noEmbeddedProcesses'>{t('animation.noEmbedded')}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};
