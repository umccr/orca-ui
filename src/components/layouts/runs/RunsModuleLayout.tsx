import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

import { ModuleNavbar } from '@/components/navigation/navbar';
import { runsModuleNavigation } from '@/utils/navigation';

const RunsModuleLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex h-full w-full flex-row'>
      <ModuleNavbar navigation={runsModuleNavigation} />
      {children || <Outlet />}
    </div>
  );
};

export default RunsModuleLayout;
