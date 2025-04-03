import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';

const MetadataLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className='h-full w-full rounded-none! p-4 sm:px-4 lg:px-8 lg:py-6'>
        <LocationBreadcrumb />
        <Suspense fallback={<SpinnerWithText text='Loading metadata page ...' />}>
          <DetailedErrorBoundary errorTitle='Unable to load metadata page'>
            {children || <Outlet />}
          </DetailedErrorBoundary>
        </Suspense>
      </div>
    </>
  );
};

export default MetadataLayout;
