import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import RunsSideNavBar from './RunsSideNavBar';
const RunsPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading library page ...' />}>
      <div className='flex h-full flex-row'>
        <div className='flex h-full'>
          <RunsSideNavBar />
        </div>
        <div className='w-full rounded-none! p-4 sm:px-4 lg:px-8 lg:py-6'>
          <LocationBreadcrumb />
          <Suspense fallback={<SpinnerWithText text='Loading runs page ...' />}>
            <DetailedErrorBoundary errorTitle='Unable to load runs page'>
              {children || <Outlet />}
            </DetailedErrorBoundary>
          </Suspense>
        </div>
      </div>
    </Suspense>
  );
};

export default RunsPageLayout;
