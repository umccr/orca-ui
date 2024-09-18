import { Suspense } from 'react';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';
import MainArea from '@/components/layouts/MainArea';
import SequenceRunTable from '../components/SequenceRunTable';

const Workflow = () => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading Recent sequence run table ...' />}>
      <DetailedErrorBoundary errorTitle='Unable to load recent sequence run'>
        <MainArea>
          <div className='text-2xl font-bold pb-2'>Sequence</div>
          <SequenceRunTable />
        </MainArea>
      </DetailedErrorBoundary>
    </Suspense>
  );
};

export default Workflow;
