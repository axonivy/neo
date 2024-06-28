import { Outlet } from '@remix-run/react';

export const Neo = () => {
  return (
    <div className='neo-layout'>
      <Outlet />
    </div>
  );
};
