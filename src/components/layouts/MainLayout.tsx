import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import navigation from '@/utils/navigation';

import Header from '@/components/navigation/header';
import { SideNavbar } from '@/components/navigation/navbar';
// import Breadcrumb from '../navigation/breadcrumbs';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-screen w-screen flex flex-col bg-heritage-blue-100 fixed'>
      <Header />
      <div className='flex flex-1 bg-heritage-blue-100'>
        <SideNavbar navigation={navigation} />
        <div className='w-full h-full flex-auto overflow-auto rounded-tl-2xl bg-white'>
          {/* <Breadcrumb /> */}
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
