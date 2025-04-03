import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import navigation from '@/utils/navigation';

import Header from '@/components/navigation/header';
import { SideNavbar } from '@/components/navigation/navbar';
// import Breadcrumb from '../navigation/breadcrumbs';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex h-screen w-screen flex-col bg-white dark:bg-gray-900'>
      <Header className='fixed w-full py-1 backdrop-blur-xs' />
      {/* `mt-12` because the header above will take space h-10 + my-1 */}
      <div className='bg-heritage-blue-100 mt-12 flex flex-1 overflow-hidden'>
        <SideNavbar navigation={navigation} className='fixed h-full w-14' />
        {/* ml-14 because the <SideNavBar /> have width of w-14 */}
        <div className='ml-14 h-full w-full flex-auto overflow-hidden rounded-tl-2xl bg-white shadow-lg transition-all duration-200 ease-in-out dark:bg-gray-900 dark:shadow-gray-800'>
          {/* <Breadcrumb className="px-4 py-2" /> */}

          <div className='scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent h-full w-full overflow-auto'>
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
