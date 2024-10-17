import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { Card } from '@/components/common/cards';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import MainArea from '../MainArea';

const MetadataLayout = ({ children }: PropsWithChildren) => {
  return (
    <MainArea>
      <Card className=' w-full h-full sm:px-4 lg:px-6 lg:py-4 p-2 !rounded-none'>
        <LocationBreadcrumb />
        <Suspense fallback={<SpinnerWithText text='Loading metadata page ...' />}>
          <DetailedErrorBoundary errorTitle='Unable to load metadata page'>
            {children || <Outlet />}
          </DetailedErrorBoundary>
        </Suspense>
      </Card>
    </MainArea>
  );
};

export default MetadataLayout;
