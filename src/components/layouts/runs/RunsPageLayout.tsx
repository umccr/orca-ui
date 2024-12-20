import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';

const RunsPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='w-full sm:px-4 lg:px-8 lg:py-6 p-4 !rounded-none'>
      <LocationBreadcrumb />
      <Suspense fallback={<SpinnerWithText text='Loading runs page ...' />}>
        <DetailedErrorBoundary errorTitle='Unable to load runs page'>
          {children || <Outlet />}
        </DetailedErrorBoundary>
      </Suspense>
    </div>
  );
};

export default RunsPageLayout;
