import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { RefObject } from 'react';
import { useUpdateTheme } from '~/theme/useUpdateTheme';
import { useHotkeyDispatcher } from '~/utils/hotkeys';
import { useWebBrowser } from './useWebBrowser';

const updateFrameTheme = (frame: RefObject<HTMLIFrameElement | null>, theme: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const setTheme = frame.current?.contentWindow?.setTheme;
  if (setTheme) {
    setTheme(theme);
  }
};

export const WebBrowser = ({ firstWebbrowserElement }: { firstWebbrowserElement?: React.Ref<HTMLButtonElement> }) => {
  const { nav, homeUrl, browser } = useWebBrowser();
  useUpdateTheme(nav.frameRef, updateFrameTheme);
  useHotkeyDispatcher(nav.frameRef);

  const tabIndex = browser.openState ? 0 : -1;

  return (
    <Flex direction='column' gap={1} style={{ height: '100%' }}>
      <Flex
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        gap={1}
        style={{ flex: '0 0 48px', paddingInline: 'var(--size-2)', borderBottom: '1px solid var(--N100)' }}
      >
        Process Simulate
        <Flex alignItems='center' gap={1}>
          <Button
            icon={IvyIcons.ArrowRight}
            rotate={180}
            title='Back'
            onClick={nav.back}
            aria-label='Go Back'
            ref={firstWebbrowserElement}
            tabIndex={tabIndex}
          />
          <Button icon={IvyIcons.ArrowRight} title='Forward' onClick={nav.forward} aria-label='Go Forward' tabIndex={tabIndex} />
          <Button icon={IvyIcons.Redo} title='Reload' onClick={nav.reload} aria-label='Reload Page' tabIndex={tabIndex} />
          <Button icon={IvyIcons.Home} title='Home' onClick={nav.home} aria-label='Go to Home' tabIndex={tabIndex} />
          <Button
            icon={IvyIcons.ExitEnd}
            title='Open in new tab'
            onClick={nav.openExternal}
            aria-label='Open in New Tab'
            tabIndex={tabIndex}
          />
        </Flex>
      </Flex>
      <iframe
        ref={nav.frameRef}
        src={homeUrl}
        title='Dev Browser'
        style={{ width: '100%', height: '100%', border: 'none' }}
        loading='lazy'
        tabIndex={tabIndex}
      />
    </Flex>
  );
};
