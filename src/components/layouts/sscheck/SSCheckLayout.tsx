import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';

const SSCheckLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-full w-full rounded-none! p-4 sm:px-4 lg:px-8 lg:py-6'>
      <Suspense fallback={<SpinnerWithText text='Loading ...' />}>
        <DetailedErrorBoundary>{children || <Outlet />}</DetailedErrorBoundary>
      </Suspense>
    </div>
  );
};

export default SSCheckLayout;
