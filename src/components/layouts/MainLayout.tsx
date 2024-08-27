import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import navigation from '@/utils/navigation';

import Header from '@/components/navigation/header';
import { SideNavbar } from '@/components/navigation/navbar';
// import Breadcrumb from '../navigation/breadcrumbs';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      <Header />
      <div className='flex flex-1'>
        <SideNavbar navigation={navigation} />
        <div className='w-full h-full'>
          {/* <Breadcrumb /> */}
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
