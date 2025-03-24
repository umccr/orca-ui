import SequenceRunDetailsActions from '../components/sequenceRuns/SequenceRunDetailsActions';
import SequenceRunDetailsLinkage from '../components/sequenceRuns/SequenceRunDetailsLinkage';
import SequenceRunDetailsTimeline from '../components/sequenceRuns/SequenceRundetailsTimeline';

const SequenceRunsDetails = () => {
  return (
    <>
      <SequenceRunDetailsActions />
      <SequenceRunDetailsLinkage />
      <SequenceRunDetailsTimeline />
    </>
  );
};

export default SequenceRunsDetails;
