import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { Card } from '../cards';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';

const MetadataLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='py-4 px-5'>
      <LocationBreadcrumb />
      <Card>
        <Suspense fallback={<SpinnerWithText text='Loading metadata page ...' />}>
          <DetailedErrorBoundary errorTitle='Unable to load metadata page'>
            {children || <Outlet />}
          </DetailedErrorBoundary>
        </Suspense>
      </Card>
    </div>
  );
};

export default MetadataLayout;
