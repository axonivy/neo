import { Outlet } from '@remix-run/react';
import { ControlBar } from './ControlBar';
import { Navigation } from './Navigation';
import { Flex } from '@axonivy/ui-components';

export const Neo = () => {
  return (
    <div className='neo-layout'>
      <ControlBar />
      <Flex direction='row' style={{ height: 'calc(100vh - 41px)' }}>
        <Navigation />
        <div style={{ width: '100%' }}>
          <Outlet />
        </div>
      </Flex>
    </div>
  );
};
