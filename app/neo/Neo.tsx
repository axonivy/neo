import { Toaster } from '@axonivy/ui-components';
import { Outlet } from '@remix-run/react';

export const Neo = () => {
  return (
    <div className='neo-layout'>
      <Outlet />
      <Toaster closeButton={true} />
    </div>
  );
};
