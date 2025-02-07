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
import { useParams } from 'react-router';
import { useStopBpmEngine } from '~/data/project-api';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { speedModes, useSettings, type AnimationFollowMode } from './useSettings';

export const AnimationSettingsMenu = () => {
  const { animation, enableAnimation, animationSpeed, animationMode } = useSettings();
  const { stopBpmEngine } = useStopBpmEngine();
  const { app, pmv } = useParams();
  const texts = useKnownHotkeys();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Animation</DropdownMenuLabel>
      <DropdownMenuCheckboxItem
        checked={animation.animate}
        onCheckedChange={enableAnimation}
        aria-label={texts.toggleAnimation.label}
        title={texts.toggleAnimation.label}
      >
        Enabled
      </DropdownMenuCheckboxItem>
      <DropdownMenuItem
        aria-label='Reset'
        disabled={!app || !pmv}
        onClick={e => {
          e.preventDefault();
          if (app && pmv) stopBpmEngine({ app, pmv });
        }}
      >
        <IvyIcon icon={IvyIcons.Undo} />
        Reset
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger aria-label={texts.animationSpeed.label} title={texts.animationSpeed.label}>
          <IvyIcon icon={IvyIcons.Clock} />
          <span>Speed</span>
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
        <DropdownMenuSubTrigger aria-label={texts.animationMode.label} title={texts.animationMode.label}>
          <IvyIcon icon={IvyIcons.Process} />
          <span>Mode</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={animation.mode} onValueChange={mode => animationMode(mode as AnimationFollowMode)}>
              <DropdownMenuRadioItem value='all'>All processes</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='currentProcess'>Only current open process</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='openProcesses'>All open processes</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='noDialogProcesses'>No dialog processes</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='noEmbeddedProcesses'>No embedded processes</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};
