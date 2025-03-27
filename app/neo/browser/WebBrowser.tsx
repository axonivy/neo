import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        {t('browser.simulate')}
        <Flex alignItems='center' gap={1}>
          <Button
            icon={IvyIcons.ArrowRight}
            rotate={180}
            title={t('browser.goBack')}
            onClick={nav.back}
            aria-label={t('browser.goBack')}
            ref={firstWebbrowserElement}
            tabIndex={tabIndex}
          />
          <Button
            icon={IvyIcons.ArrowRight}
            title={t('browser.goForward')}
            onClick={nav.forward}
            aria-label={t('browser.goForward')}
            tabIndex={tabIndex}
          />
          <Button
            icon={IvyIcons.Redo}
            title={t('browser.reloadPage')}
            onClick={nav.reload}
            aria-label={t('browser.reloadPage')}
            tabIndex={tabIndex}
          />
          <Button
            icon={IvyIcons.Home}
            title={t('browser.goHome')}
            onClick={nav.home}
            aria-label={t('browser.goHome')}
            tabIndex={tabIndex}
          />
          <Button
            icon={IvyIcons.ExitEnd}
            title={t('browser.openNewTab')}
            onClick={nav.openExternal}
            aria-label={t('browser.openNewTab')}
            tabIndex={tabIndex}
          />
        </Flex>
      </Flex>
      <iframe
        ref={nav.frameRef}
        src={homeUrl}
        title={t('browser.devBrowser')}
        style={{ width: '100%', height: '100%', border: 'none' }}
        loading='lazy'
        tabIndex={tabIndex}
      />
    </Flex>
  );
};
