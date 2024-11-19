import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
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
import { useSettings, type AnimationFollowMode } from './useSettings';

export const AnimationSettings = () => {
  const { animation, enableAnimation, animationSpeed, animationMode } = useSettings();
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Animation</DropdownMenuLabel>
      <DropdownMenuCheckboxItem checked={animation.animate} onCheckedChange={enableAnimation} aria-label='Toggle animation'>
        Enabled
      </DropdownMenuCheckboxItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger aria-label='Animation speed'>
          <IvyIcon icon={IvyIcons.Clock} />
          <span>Speed</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={6} collisionPadding={10}>
            <DropdownMenuRadioGroup value={animation.speed.toString()} onValueChange={animationSpeed}>
              <DropdownMenuRadioItem value='0' aria-label='0'>
                0
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='25' aria-label='25'>
                25
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='50' aria-label='50'>
                50
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='75' aria-label='75'>
                75
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='100' aria-label='100'>
                100
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
