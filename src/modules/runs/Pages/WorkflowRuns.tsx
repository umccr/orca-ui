import { Suspense } from 'react';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';
import MainArea from '@/components/layouts/MainArea';
import WorkflowTable from '../components/WorkflowRunTable';

const Workflow = () => {
  console.log('workflows');
  return (
    <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
      <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
        <MainArea>
          <div className='text-2xl font-bold'>Workflow</div>
          <WorkflowTable />
        </MainArea>
      </DetailedErrorBoundary>
    </Suspense>
  );
};

export default Workflow;
