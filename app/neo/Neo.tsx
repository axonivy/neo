import { Outlet } from '@remix-run/react';
import { ControlBar } from './ControlBar';
import { Navigation } from './Navigation';
import { Flex, Toaster } from '@axonivy/ui-components';
import { renderEditor, useEditors } from './useEditors';

export const Neo = () => {
  const { editors } = useEditors();
  return (
    <div className='neo-layout'>
      <ControlBar />
      <Flex direction='row' style={{ height: 'calc(100vh - 41px)' }}>
        <Navigation />
        <div style={{ width: '100%' }}>
          <Outlet />
          {editors.map(renderEditor)}
        </div>
      </Flex>
      <Toaster closeButton={true} />
    </div>
  );
};
