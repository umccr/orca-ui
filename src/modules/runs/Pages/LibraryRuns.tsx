import { Suspense } from 'react';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';
import LibraryTable from '../components/libraryRuns/LibraryTable';

const LibraryRuns = () => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
      <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
        {/* <div className='text-2xl font-bold'>LibraryRuns</div> */}
        <LibraryTable />
      </DetailedErrorBoundary>
    </Suspense>
  );
};

export default LibraryRuns;
