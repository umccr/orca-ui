import SequenceRunWorkflowRunsStats from '../components/sequenceRuns/SequenceRunWorkflowRunsStats';
import SequenceRunWorkflowRuns from '../components/sequenceRuns/SequenceRunWorkflowRuns';

const SequenceRunsWorkflowRuns = () => {
  return (
    <div className='flex flex-col gap-4'>
      <SequenceRunWorkflowRunsStats />
      <SequenceRunWorkflowRuns />
    </div>
  );
};

export default SequenceRunsWorkflowRuns;
