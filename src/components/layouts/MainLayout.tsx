import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import navigation from '@/utils/navigation';

import Header from '@/components/navigation/header';
import { SideNavbar } from '@/components/navigation/navbar';
// import Breadcrumb from '../navigation/breadcrumbs';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-screen w-screen flex flex-col'>
      <Header className='py-1 fixed' />
      {/* `mt-12` because the header above will take space h-10 + my-1 */}
      <div className='bg-heritage-blue-100 flex flex-1 mt-12'>
        <SideNavbar navigation={navigation} className='fixed h-full w-14' />
        {/* ml-14 because the <SideNavBar /> have width of w-14 */}
        <div className='ml-14 w-full h-full flex-auto overflow-auto rounded-tl-2xl bg-white'>
          {/* <Breadcrumb /> */}
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
