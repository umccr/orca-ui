import { Suspense } from 'react';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';
import MainArea from '@/components/layouts/MainArea';
import LibraryTable from '../components/LibraryTable';

const LibraryRuns = () => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
      <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
        <MainArea>
          <div className='text-2xl font-bold'>LibraryRuns</div>
          <LibraryTable />
        </MainArea>
      </DetailedErrorBoundary>
    </Suspense>
  );
};

export default LibraryRuns;
