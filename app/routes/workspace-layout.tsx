import runtimeLogStylesHref from '@axonivy/log-view/lib/view.css?url';
import {
  Field,
  Flex,
  Label,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
  Switch,
  Tabs,
  useHotkeys
} from '@axonivy/ui-components';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams, type LinksFunction } from 'react-router';
import { Navigation } from '~/neo/Navigation';
import { WebBrowser } from '~/neo/browser/WebBrowser';
import { useWebBrowser } from '~/neo/browser/useWebBrowser';
import { NeoClientProvider } from '~/neo/client/useNeoClient';
import { ControlBar } from '~/neo/control-bar/ControlBar';
import { EditorsControl } from '~/neo/control-bar/EditorControl';
import { EditorTabs } from '~/neo/control-bar/EditorTabs';
import { MountedEditor } from '~/neo/editors/MountedEditor';
import { renderEditor, useEditors } from '~/neo/editors/useEditors';
import { useViews, ViewContent, ViewTabs, type ViewIds } from '~/neo/views/Views';
import { useKnownHotkeys } from '~/utils/hotkeys';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: runtimeLogStylesHref }];

export default function Index() {
  const { editors } = useEditors();
  const { browser } = useWebBrowser();
  const { ws } = useParams();
  const firstWebbrowserElement = useRef<HTMLButtonElement>(null);
  const { openSimulation, resizeSimulation } = useKnownHotkeys();
  const { t } = useTranslation();
  useHotkeys(openSimulation.hotkey, () => {
    browser.toggle();
    if (!browser.openState) {
      setTimeout(() => {
        firstWebbrowserElement.current?.focus();
      }, 0);
    }
  });
  useHotkeys(resizeSimulation.hotkey, browser.cycleSize);
  const views = useViews();

  return (
    <NeoClientProvider>
      <ControlBar>
        <>
          <EditorTabs />
          <Flex alignItems='center' gap={1} style={{ paddingInline: 'var(--size-2)', marginInlineStart: 'auto', flex: '0 0 auto' }}>
            <EditorsControl />
            <Separator orientation='vertical' style={{ margin: 'var(--size-2)' }} />
            <Field direction='row' alignItems='center' gap={2} title={openSimulation.label} aria-label={openSimulation.label}>
              <Label>{t('settings.simulate')}</Label>
              <Switch checked={browser.openState} onClick={browser.toggle} />
            </Field>
          </Flex>
        </>
      </ControlBar>
      <ResizablePanelGroup direction='horizontal' style={{ height: '100vh' }} autoSaveId={`neo-layout-${ws}`}>
        <ResizablePanel id='Neo'>
          <Flex direction='row' style={{ height: 'calc(100vh - 41px)', width: '100%' }}>
            <Navigation />
            <Tabs variant='slim' value={views.view} onValueChange={value => views.setView(value as ViewIds)} style={{ flex: 1 }}>
              <ResizablePanelGroup direction='vertical' autoSaveId={`neo-layout-${ws}-2`}>
                <ResizablePanel id='Neo2'>
                  <div style={{ width: '100%', height: '100%' }}>
                    <Outlet />
                    {editors.map(editor => (
                      <MountedEditor key={editor.id} {...editor}>
                        {renderEditor(editor)}
                      </MountedEditor>
                    ))}
                  </div>
                </ResizablePanel>
                <ResizableHandle>
                  <ViewTabs {...views} />
                </ResizableHandle>
                <ResizablePanel ref={views.viewsRef} id='Views' collapsible defaultSize={0} maxSize={50} minSize={10}>
                  <ViewContent />
                </ResizablePanel>
              </ResizablePanelGroup>
            </Tabs>
          </Flex>
        </ResizablePanel>

        <ResizableHandle style={{ width: 3, height: 'calc(100% - 42px)', backgroundColor: 'var(--N200)' }} />
        <ResizablePanel ref={browser.panelRef} id='Browser' collapsible defaultSize={0} maxSize={70} minSize={10}>
          <WebBrowser firstWebbrowserElement={firstWebbrowserElement} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </NeoClientProvider>
  );
}
