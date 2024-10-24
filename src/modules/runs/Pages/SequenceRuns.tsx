import { DetailedErrorBoundary } from '@/components/common/error';
import MainArea from '@/components/layouts/MainArea';
import SequenceRunTable from '../components/sequenceRuns/SequenceRunTable';
import SequenceRunFilterHeader from '../components/sequenceRuns/SequenceRunFilterHeader';
const Workflow = () => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load recent sequence runs data'>
      <MainArea>
        {/* <div className='text-2xl font-bold py-2'>Sequence</div> */}
        <SequenceRunFilterHeader />
        <SequenceRunTable />
      </MainArea>
    </DetailedErrorBoundary>
  );
};

export default Workflow;
