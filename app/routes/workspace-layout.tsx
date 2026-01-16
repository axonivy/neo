import runtimeLogStylesHref from '@axonivy/log-view/lib/view.css?url';
import {
  Button,
  Flex,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  Separator,
  Tabs,
  useDefaultLayout,
  useHotkeys
} from '@axonivy/ui-components';
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
      if (!browser.isOpen()) {
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

  const { defaultLayout: outerLayout, onLayoutChanged: onOuterLayoutChanged } = useDefaultLayout({
    groupId: `neo-layout-${ws}`,
    storage: localStorage
  });
  const { defaultLayout: innerLayout, onLayoutChanged: onInnerLayoutChanged } = useDefaultLayout({
    groupId: `neo-layout-${ws}-2`,
    storage: localStorage
  });

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
      <ResizableGroup
        orientation='horizontal'
        style={{ height: '100vh' }}
        defaultLayout={outerLayout}
        onLayoutChanged={onOuterLayoutChanged}
      >
        <ResizablePanel id='Neo'>
          <Flex direction='row' style={{ height: 'calc(100vh - 41px)', width: '100%' }}>
            <Navigation />
            <Tabs
              variant='slim'
              value={views.view}
              onValueChange={value => views.setView(value as ViewIds)}
              style={{ flex: 1, maxWidth: 'calc(100% - 50px)' }}
            >
              <ResizableGroup orientation='vertical' defaultLayout={innerLayout} onLayoutChanged={onInnerLayoutChanged}>
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
                  panelRef={views.viewsRef}
                  id='Views'
                  collapsible
                  defaultSize='0%'
                  maxSize='50%'
                  minSize='10%'
                  style={{ overflow: 'auto' }}
                  onResize={panelSize => views.setViewsExpanded(panelSize.asPercentage > 0)}
                >
                  {views.isViewsExpanded() && <ViewContent />}
                </ResizablePanel>
              </ResizableGroup>
            </Tabs>
          </Flex>
        </ResizablePanel>

        <ResizableHandle className='browser-resize-handle' style={{ width: 3, height: 'calc(100% - 42px)' }} />
        <ResizablePanel
          panelRef={browser.panelRef}
          id='Browser'
          collapsible
          defaultSize='0%'
          maxSize='70%'
          minSize='10%'
          onResize={panelSize => browser.setOpenState(panelSize.asPercentage > 0)}
        >
          <WebBrowser firstWebbrowserElement={firstWebbrowserElement} />
        </ResizablePanel>
      </ResizableGroup>
    </NeoClientProvider>
  );
}
