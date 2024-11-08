import WorkflowRunTimeline from '../components/workflowRuns/WorkflowRunTimeline';
import WorkflowRunDetailsTable from '../components/workflowRuns/WorkflowRunDetailsTable';

const WorkflowRunDetails = () => {
  return (
    <div className='flex flex-col gap-4 h-full w-full'>
      <WorkflowRunDetailsTable />

      <WorkflowRunTimeline />
    </div>
  );
};

export default WorkflowRunDetails;
