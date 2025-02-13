import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import { LibrarySideNavBar } from './components/LibrarySideNavBar';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { LibraryDetailBar } from './components/LibraryDetailBar';

const LibraryLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading library page ...' />}>
      <div className='flex h-full flex-row'>
        <div className='flex h-full'>
          <LibrarySideNavBar />
        </div>
        <div className='flex min-w-[450px] flex-1 flex-col overflow-auto overflow-x-auto px-8 py-4'>
          <LocationBreadcrumb className='mb-4' />

          {/* <LibraryBreadCrumb /> */}
          <Suspense fallback={<SpinnerWithText text='Loading library page' />}>
            <DetailedErrorBoundary errorTitle='Unable to load library page'>
              {children || <Outlet />}
            </DetailedErrorBoundary>
          </Suspense>
        </div>
        <div className='flex h-full'>
          <LibraryDetailBar />
        </div>
      </div>
    </Suspense>
  );
};

export default LibraryLayout;
