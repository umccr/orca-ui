import { ReactNode, Suspense } from 'react';

import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/common/sidebar';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
            <div className='mt-4 flex-grow overflow-auto pr-8'>
              <div className='mb-4 flex items-center justify-start rounded-md bg-yellow-100 p-3 text-yellow-700'>
                <ExclamationTriangleIcon
                  className='mr-2 h-5 w-5 flex-shrink-0'
                  aria-hidden='true'
                />
                <p className='text-xs'>
                  <strong>Warning:</strong> This Vault page is experimental and may have some issues
                  or inconsistencies. For more reliable data, please check the metadata table on the
                  Lab page.
                </p>
              </div>
              {children || <Outlet />}{' '}
            </div>
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
