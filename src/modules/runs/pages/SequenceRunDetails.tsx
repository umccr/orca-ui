import SequenceRunDetailsActions from '../components/sequenceRuns/SequenceRunDetailsActions';
import SequenceRunDetailsLinkage from '../components/sequenceRuns/SequenceRunDetailsLinkage';
import SequenceRunDetailsTimeline from '../components/sequenceRuns/SequenceRundetailsTimeline';
import { SequenceRunDetailsProvider } from '../components/sequenceRuns/SequenceRunDetailsContext';

const SequenceRunsDetails = () => {
  return (
    <SequenceRunDetailsProvider>
      <SequenceRunDetailsActions />
      <SequenceRunDetailsLinkage />
      <SequenceRunDetailsTimeline />
    </SequenceRunDetailsProvider>
  );
};

export default SequenceRunsDetails;
