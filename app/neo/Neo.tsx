import { Toaster } from '@axonivy/ui-components';
import { Outlet } from 'react-router';

export const Neo = () => {
  return (
    <div className='neo-layout'>
      <Outlet />
      <Toaster closeButton={true} />
    </div>
  );
};
