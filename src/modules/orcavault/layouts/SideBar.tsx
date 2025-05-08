import { ReactNode, Suspense } from 'react';

import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/common/sidebar';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';

type Props = {
  children: ReactNode;
  sideBar?: ReactNode;
};

const SideBarLayout = ({ children, sideBar }: Props) => {
  return (
    <div className='h-full w-full rounded-none! p-4 sm:px-4 lg:px-8 lg:py-6'>
      <LocationBreadcrumb className='mb-0' />
      <DetailedErrorBoundary errorTitle='Unable to load page'>
        <Suspense fallback={<SpinnerWithText text='Loading page ...' />}>
          <div className='flex h-full w-full flex-row'>
            <div className='mt-4 flex-grow overflow-auto pr-8'>{children || <Outlet />} </div>
            {sideBar && (
              <div className='flex h-full'>
                <Sidebar
                  position='right'
                  preferenceStorageKey='vault-filter-sidebar'
                  openWidth='w-max'
                >
                  {sideBar}
                </Sidebar>
              </div>
            )}
          </div>
        </Suspense>
      </DetailedErrorBoundary>
    </div>
  );
};

export default SideBarLayout;
