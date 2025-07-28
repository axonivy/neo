import { Button, Flex, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ReactNode } from 'react';
import { useKnownHotkeys } from '~/utils/hotkeys';

export const CreateNewArtefactButton = ({ title, onClick }: { title: string; onClick: () => void }) => {
  const { addElement } = useKnownHotkeys(title);
  useHotkeys(addElement.hotkey, onClick, { keydown: false, keyup: true, scopes: ['neo'] });

  return (
    <Button
      title={addElement.label}
      icon={IvyIcons.Plus}
      size='large'
      variant='primary'
      aria-label={addElement.label}
      onClick={onClick}
      style={{ height: 32, whiteSpace: 'nowrap' }}
    >
      {title}
    </Button>
  );
};

export const Overview = ({ children }: { children: ReactNode }) => (
  <Flex
    direction='column'
    gap={4}
    style={{ fontSize: 16, padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}
    className='overview'
  >
    {children}
  </Flex>
);
