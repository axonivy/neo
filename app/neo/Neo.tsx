import { Outlet } from '@remix-run/react';
import { ControlBar } from './ControlBar';
import { Navigation } from './Navigation';
import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup, Toaster } from '@axonivy/ui-components';
import { renderEditor, useEditors } from './useEditors';
import { WebBrowser } from './browser/WebBrowser';
import { useWebBrowser } from './browser/useWebBrowser';
import { ProjectIdentifier } from '~/data/project-api';
import { NewArtifactDialog } from './dialog/NewArtifactDialog';
import { NewArtifactDialogProvider } from './dialog/useNewArtifactDialog';

export const Neo = () => {
  const { editors } = useEditors();
  const { browser } = useWebBrowser();
  return (
    <div className='neo-layout'>
      <ControlBar toggleBrowser={browser.toggle} />
      <ResizablePanelGroup direction='horizontal' style={{ height: '100vh' }} autoSaveId='neo-layout'>
        <ResizablePanel id='Neo'>
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
        <ResizablePanel ref={browser.panelRef} id='Browser' collapsible defaultSize={0} maxSize={70} minSize={10}>
          <WebBrowser />
        </ResizablePanel>
      </ResizablePanelGroup>
      <NewArtifactDialog />
    </div>
  );
};
