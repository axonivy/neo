import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { RefObject } from 'react';
import { useUpdateTheme } from '~/theme/useUpdateTheme';
import { useWebBrowser } from './useWebBrowser';

const updateFrameTheme = (frame: RefObject<HTMLIFrameElement | null>, theme: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const setTheme = frame.current?.contentWindow?.setTheme;
  if (setTheme) {
    setTheme(theme);
  }
};

export const WebBrowser = () => {
  const { nav, homeUrl } = useWebBrowser();
  useUpdateTheme(nav.frameRef, updateFrameTheme);
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
          <Button icon={IvyIcons.ArrowRight} rotate={180} title='Back' onClick={nav.back} />
          <Button icon={IvyIcons.ArrowRight} title='Forward' onClick={nav.forward} />
          <Button icon={IvyIcons.Redo} title='Reload' onClick={nav.reload} />
          <Button icon={IvyIcons.Home} title='Home' onClick={nav.home} />
          <Button icon={IvyIcons.ExitEnd} title='Open in new tab' onClick={nav.openExternal} />
        </Flex>
      </Flex>
      <iframe
        ref={nav.frameRef}
        src={homeUrl}
        title='Dev Browser'
        style={{ width: '100%', height: '100%', border: 'none' }}
        loading='lazy'
      />
    </Flex>
  );
};
