import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import MainArea from '../MainArea';

const FilesLayout = ({ children }: PropsWithChildren) => {
  return (
    <MainArea>
      <div className='w-full h-full sm:px-4 lg:px-8 lg:py-6 p-4 !rounded-none'>
        <LocationBreadcrumb />
        <Suspense fallback={<SpinnerWithText text='Loading ...' />}>
          <DetailedErrorBoundary errorTitle='Unable to load files page'>
            {children || <Outlet />}
          </DetailedErrorBoundary>
        </Suspense>
      </div>
    </MainArea>
  );
};

export default FilesLayout;
