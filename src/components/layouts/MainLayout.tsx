import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import navigation from '@/utils/navigation';

import Header from '@/components/navigation/header';
import Navbar from '@/components/navigation/navbar';
import Breadcrumb from '../navigation/breadcrumbs';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-1'>
        <Navbar navigation={navigation} />
        <div className='flex flex-1 bg-magpie-light-25 pt-4 px-10'>
          <div className='w-full'>
            <Breadcrumb />
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
