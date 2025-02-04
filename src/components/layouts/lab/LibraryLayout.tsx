import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import { LibrarySideNavBar } from './components/LibrarySideNavBar';
// import { LibraryBreadCrumb } from './components/LibraryBreadCrumb';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
// import { Dropdown } from '@/components/common/dropdowns';

const LibraryLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading library page ...' />}>
      <div className='flex h-full flex-row'>
        <div className='flex h-full'>
          <LibrarySideNavBar />
        </div>
        <div className='flex min-w-[450px] flex-1 flex-col overflow-auto overflow-x-auto px-8 py-4'>
          <LocationBreadcrumb />

          {/* Will comment library versioning for now */}
          {/* <div className='flex flex-row justify-between space-x-4'>
            <LibraryBreadCrumb />
            <Dropdown className='' items={[{ label: 'RESEARCH' }]} value='RESEARCH' />
          </div> */}

          <Suspense fallback={<SpinnerWithText text='Loading library page' />}>
            <DetailedErrorBoundary errorTitle='Unable to load library page'>
              {children || <Outlet />}
            </DetailedErrorBoundary>
          </Suspense>
        </div>
      </div>
    </Suspense>
  );
};

export default LibraryLayout;
