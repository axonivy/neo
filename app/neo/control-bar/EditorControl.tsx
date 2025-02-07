import { Button, Flex, Popover, PopoverContent, PopoverTrigger, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { useEditors } from '../editors/useEditors';

export const EditorsControl = () => {
  const [subMenu, setSubMenu] = useState(false);
  const { editors, closeAllEditors } = useEditors();

  const { closeAllTabs } = useKnownHotkeys();
  useHotkeys(closeAllTabs.hotkey, () => closeAllEditors());

  if (editors.length === 0) {
    return null;
  }
  return (
    <Popover open={subMenu} onOpenChange={setSubMenu}>
      <PopoverTrigger asChild>
        <Button icon={IvyIcons.Dots} size='large' />
      </PopoverTrigger>
      <PopoverContent sideOffset={6} collisionPadding={10} side='bottom' align='end' style={{ border: 'var(--basic-border)' }}>
        <Flex direction='column'>
          <Button
            icon={IvyIcons.Close}
            onClick={() => {
              closeAllEditors();
              setSubMenu(false);
            }}
            aria-label={closeAllTabs.label}
            title={closeAllTabs.label}
          >
            Close all
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
