import { Button, Popover, PopoverContent, PopoverTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

export const InfoPopover = ({ info, buttonColor }: { info: string; buttonColor?: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button size='small' style={{ color: buttonColor ?? 'var(--P300)' }} icon={IvyIcons.InfoCircle} />
    </PopoverTrigger>
    <PopoverContent sideOffset={10} align='start' collisionPadding={20} style={{ borderRadius: '10px', maxWidth: 383, padding: 15 }}>
      <span style={{ lineHeight: '22px', fontSize: 16, fontWeight: 400, color: 'var(--N900)' }}>{info}</span>
    </PopoverContent>
  </Popover>
);
