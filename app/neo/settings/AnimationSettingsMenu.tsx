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
import type { AnimationSettings } from '~/data/neo-jsonrpc';
import { useStopBpmEngine } from '~/data/project-api';
import { useSettings, type AnimationFollowMode } from './useSettings';

export const AnimationSettingsMenu = (animation: AnimationSettings) => {
  const { enableAnimation, animationSpeed, animationMode } = useSettings();
  const { stopBpmEngine } = useStopBpmEngine();
  const { app, pmv } = useParams();
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Animation</DropdownMenuLabel>
      <DropdownMenuCheckboxItem checked={animation.animate} onCheckedChange={enableAnimation} aria-label='Toggle animation'>
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
        <DropdownMenuSubTrigger aria-label='Animation speed'>
          <IvyIcon icon={IvyIcons.Clock} />
          <span>Speed</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={animation.speed.toString()} onValueChange={animationSpeed}>
              <DropdownMenuRadioItem value='0' aria-label='fastest'>
                fastest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='25' aria-label='fast'>
                fast
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='50' aria-label='normal'>
                normal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='75' aria-label='slow'>
                slow
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='100' aria-label='slowest'>
                slowest
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
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
