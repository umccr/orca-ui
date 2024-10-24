import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Card } from '@/components/common/cards';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import { LibrarySideNavBar } from './components/LibrarySideNavBar';
import { LibraryBreadCrumb } from './components/LibraryBreadCrumb';
import { Dropdown } from '@/components/common/dropdowns';

const LibraryLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading library page ...' />}>
      <div className='flex flex-row h-full'>
        <div className='flex h-full'>
          <LibrarySideNavBar />
        </div>
        <div className='flex flex-1 flex-col py-4 px-5 overflow-auto min-w-[450px] overflow-x-auto'>
          <div className='flex flex-row justify-between space-x-4'>
            <LibraryBreadCrumb />

            {/* Will comment library versioning for now */}
            <Dropdown className='' items={[{ label: 'RESEARCH' }]} value='RESEARCH' />
          </div>

          <Card className='mt-3'>
            <Suspense fallback={<SpinnerWithText text='Loading library page' />}>
              <DetailedErrorBoundary errorTitle='Unable to load library page'>
                {children || <Outlet />}
              </DetailedErrorBoundary>
            </Suspense>
          </Card>
        </div>
      </div>
    </Suspense>
  );
};

export default LibraryLayout;
