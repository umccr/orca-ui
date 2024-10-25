import { DetailedErrorBoundary } from '@/components/common/error';
import SequenceRunTable from '../components/sequenceRuns/SequenceRunTable';
import SequenceRunFilterHeader from '../components/sequenceRuns/SequenceRunFilterHeader';
const Workflow = () => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load recent sequence runs data'>
      <div className='w-full h-full'>
        {/* <div className='text-2xl font-bold py-2'>Sequence</div> */}
        <SequenceRunFilterHeader />
        <SequenceRunTable />
      </div>
    </DetailedErrorBoundary>
  );
};

export default Workflow;
