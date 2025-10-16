/* eslint-disable react-hooks/refs */
import runtimeLogStylesHref from '@axonivy/log-view/lib/view.css?url';
import { Button, Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup, Separator, Tabs, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { Outlet, useParams, type LinksFunction } from 'react-router';
import { WebBrowser } from '~/neo/browser/WebBrowser';
import { useWebBrowser } from '~/neo/browser/useWebBrowser';
import { NeoClientProvider } from '~/neo/client/useNeoClient';
import { ControlBar } from '~/neo/control-bar/ControlBar';
import { EditorsControl } from '~/neo/control-bar/EditorControl';
import { EditorTabs } from '~/neo/control-bar/EditorTabs';
import { MountedEditor } from '~/neo/editors/MountedEditor';
import { renderEditor, useEditors } from '~/neo/editors/useEditors';
import { Navigation } from '~/neo/navigation/Navigation';
import { useViews, ViewContent, ViewTabs, type ViewIds } from '~/neo/views/Views';
import { useKnownHotkeys } from '~/utils/hotkeys';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: runtimeLogStylesHref }];

export default function Index() {
  const { editors } = useEditors();
  const { browser } = useWebBrowser();
  const { ws } = useParams();
  const firstWebbrowserElement = useRef<HTMLButtonElement>(null);
  const { openSimulation, resizeSimulation } = useKnownHotkeys();

  useHotkeys(
    openSimulation.hotkey,
    () => {
      browser.toggle();
      if (!browser.openState) {
        setTimeout(() => {
          firstWebbrowserElement.current?.focus();
        }, 0);
      }
    },
    { scopes: ['neo'] }
  );
  useHotkeys(resizeSimulation.hotkey, browser.cycleSize, { scopes: ['neo'] });
  const views = useViews();
  const { openPanel } = useKnownHotkeys();
  useHotkeys(openPanel.hotkey, () => views.toggleView(), { scopes: ['neo'] });

  return (
    <NeoClientProvider>
      <ControlBar>
        <>
          <EditorTabs />
          <Flex alignItems='center' gap={1} style={{ paddingInline: 'var(--size-2)', marginInlineStart: 'auto', flex: '0 0 auto' }}>
            <EditorsControl />
            <Separator orientation='vertical' style={{ margin: 'var(--size-2)' }} />
            <Button
              onClick={views.toggleView}
              rotate={270}
              icon={IvyIcons.PoolSwimlanes}
              title={openPanel.label}
              aria-label={openPanel.label}
            />
            <Button
              onClick={browser.toggle}
              rotate={180}
              icon={IvyIcons.PoolSwimlanes}
              title={openSimulation.label}
              aria-label={openSimulation.label}
            />
          </Flex>
        </>
      </ControlBar>
      <ResizablePanelGroup direction='horizontal' style={{ height: '100vh' }} autoSaveId={`neo-layout-${ws}`}>
        <ResizablePanel id='Neo'>
          <Flex direction='row' style={{ height: 'calc(100vh - 41px)', width: '100%' }}>
            <Navigation />
            <Tabs
              variant='slim'
              value={views.view}
              onValueChange={value => views.setView(value as ViewIds)}
              style={{ flex: 1, maxWidth: 'calc(100% - 50px)' }}
            >
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
                <ResizablePanel
                  ref={views.viewsRef}
                  onCollapse={() => views.setViewsCollapsed(false)}
                  onExpand={() => views.setViewsCollapsed(true)}
                  id='Views'
                  collapsible
                  defaultSize={0}
                  maxSize={50}
                  minSize={10}
                  style={{ overflow: 'auto' }}
                >
                  {views.viewsCollapsed && <ViewContent />}
                </ResizablePanel>
              </ResizablePanelGroup>
            </Tabs>
          </Flex>
        </ResizablePanel>

        <ResizableHandle className='browser-resize-handle' style={{ width: 3, height: 'calc(100% - 42px)' }} />
        <ResizablePanel
          ref={browser.panelRef}
          onCollapse={() => browser.setOpenState(false)}
          onExpand={() => browser.setOpenState(true)}
          id='Browser'
          collapsible
          defaultSize={0}
          maxSize={70}
          minSize={10}
        >
          <WebBrowser firstWebbrowserElement={firstWebbrowserElement} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </NeoClientProvider>
  );
}
