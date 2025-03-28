import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import { LibrarySideNavBar } from './components/LibrarySideNavBar';
import { LibraryDetailBar } from './components/LibraryDetailBar';
import { LibraryBreadCrumb } from './components/LibraryBreadCrumb';

const LibraryLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading library page ...' />}>
      <div className='flex h-full flex-row'>
        <div className='flex h-full'>
          <LibrarySideNavBar />
        </div>
        {/* <div className='flex min-w-[450px] flex-1 flex-col overflow-auto overflow-x-auto'> */}
        <div className='flex min-w-[450px] flex-1 flex-col overflow-auto overflow-x-auto px-8 py-4'>
          <LibraryBreadCrumb className='' />

          <div className='flex h-full flex-row'>
            {/* {children || <Outlet />} */}
            <Suspense fallback={<SpinnerWithText text='Loading library page' />}>
              <DetailedErrorBoundary errorTitle='Unable to load library page'>
                <div className='mt-4 w-full pr-8'>{children || <Outlet />}</div>
              </DetailedErrorBoundary>
            </Suspense>
            <div className='flex h-full'>
              <LibraryDetailBar />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LibraryLayout;
