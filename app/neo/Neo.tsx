import { Outlet } from '@remix-run/react';
import { ControlBar } from './ControlBar';
import { Navigation } from './Navigation';
import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup, Toaster } from '@axonivy/ui-components';
import { renderEditor, useEditors } from './useEditors';
import { useRef } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { WebBrowser } from './WebBrowser';

export const Neo = () => {
  const { editors } = useEditors();
  const browserPanel = useRef<ImperativePanelHandle>(null);
  const toggleBrowser = () => {
    if (browserPanel.current?.isCollapsed()) {
      browserPanel.current?.expand(40);
    } else {
      browserPanel.current?.collapse();
    }
  };
  return (
    <div className='neo-layout'>
      <ControlBar toggleBrowser={toggleBrowser} />
      <ResizablePanelGroup direction='horizontal' style={{ height: '100vh' }}>
        <ResizablePanel title='Neo'>
          <Flex direction='row' style={{ height: 'calc(100vh - 41px)' }}>
            <Navigation />
            <div style={{ width: '100%' }}>
              <Outlet />
              {editors.map(renderEditor)}
            </div>
          </Flex>
          <Toaster closeButton={true} />
        </ResizablePanel>
        <ResizableHandle style={{ width: 3, backgroundColor: 'var(--N200)' }} />
        <ResizablePanel ref={browserPanel} title='Browser' collapsible defaultSize={0} maxSize={70} minSize={10}>
          <WebBrowser />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
