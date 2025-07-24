import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateTheme } from '~/theme/useUpdateTheme';
import { useHotkeyDispatcher } from '~/utils/hotkeys';
import { useSidePanel } from '../workspace/useSidePanel';

const updateFrameTheme = (frame: RefObject<HTMLIFrameElement | null>, theme: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const setTheme = frame.current?.contentWindow?.setTheme;
  if (setTheme) {
    setTheme(theme);
  }
};

export const WebBrowser = ({ firstWebbrowserElement }: { firstWebbrowserElement?: React.Ref<HTMLButtonElement> }) => {
  const { t } = useTranslation();
  const { nav, homeUrl, sidePanel } = useSidePanel();
  useUpdateTheme(nav.browserFrameRef, updateFrameTheme);
  useHotkeyDispatcher(nav.browserFrameRef);
  return (
    <Flex direction='column' gap={1} style={{ height: '100%', display: sidePanel.openState ? undefined : 'none' }}>
      <Flex
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        gap={1}
        style={{ flex: '0 0 48px', paddingInline: 'var(--size-2)', borderBottom: '1px solid var(--N100)' }}
      >
        <Flex alignItems='center' gap={1}>
          <Button
            icon={IvyIcons.ArrowRight}
            rotate={180}
            title={t('browser.goBack')}
            onClick={nav.back}
            aria-label={t('browser.goBack')}
            ref={firstWebbrowserElement}
          />
          <Button icon={IvyIcons.ArrowRight} title={t('browser.goForward')} onClick={nav.forward} aria-label={t('browser.goForward')} />
          <Button icon={IvyIcons.Redo} title={t('browser.reloadPage')} onClick={nav.reload} aria-label={t('browser.reloadPage')} />
          <Button icon={IvyIcons.Home} title={t('browser.goHome')} onClick={nav.home} aria-label={t('browser.goHome')} />
          <Button icon={IvyIcons.ExitEnd} title={t('browser.openNewTab')} onClick={nav.openExternal} aria-label={t('browser.openNewTab')} />
        </Flex>
      </Flex>
      <iframe
        ref={nav.browserFrameRef}
        src={homeUrl}
        title={t('browser.devBrowser')}
        style={{ width: '100%', height: '100%', border: 'none' }}
        loading='lazy'
      />
    </Flex>
  );
};
