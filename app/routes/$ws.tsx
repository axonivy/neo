import { Button, Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup, Separator, Toaster } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { ControlBar, EditorTabs, EditorsControl } from '~/neo/ControlBar';
import { Navigation } from '~/neo/Navigation';
import { WebBrowser } from '~/neo/browser/WebBrowser';
import { useWebBrowser } from '~/neo/browser/useWebBrowser';
import { cardLinks } from '~/neo/artifact/ArtifactCard';
import { renderEditor, useEditors } from '~/neo/editors/useEditors';

export const links: LinksFunction = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  const { editors } = useEditors();
  const { browser } = useWebBrowser();
  return (
    <>
      <ControlBar>
        <>
          <EditorTabs />
          <Flex alignItems='center' gap={1} style={{ paddingInline: 'var(--size-2)', marginInlineStart: 'auto', flex: '0 0 auto' }}>
            <EditorsControl />
            <Separator orientation='vertical' style={{ margin: 'var(--size-2)' }} />
            <Button icon={IvyIcons.Play} size='large' variant='primary' onClick={browser.toggle}>
              Run process
            </Button>
          </Flex>
        </>
      </ControlBar>
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
    </>
  );
}
