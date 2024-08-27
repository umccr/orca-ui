import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { Card } from '@/components/common/cards';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import MainArea from '../MainArea';

const SubjectLayout = ({ children }: PropsWithChildren) => {
  return (
    <MainArea>
      <LocationBreadcrumb />
      <Card>
        <Suspense fallback={<SpinnerWithText text='Loading subject page ...' />}>
          <DetailedErrorBoundary errorTitle='Unable to load subject page'>
            {children || <Outlet />}
          </DetailedErrorBoundary>
        </Suspense>
      </Card>
    </MainArea>
  );
};

export default SubjectLayout;
