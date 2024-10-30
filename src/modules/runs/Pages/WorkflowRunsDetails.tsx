import WorkflowRunTimeline from '../components/workflowRuns/WorkflowRunTimeline';
import WorkflowRunDetailsTable from '../components/workflowRuns/WorkflowRunDetailsTable';

const WorkflowRunDetails = () => {
  return (
    <div>
      <WorkflowRunDetailsTable />
      <div className='pt-4'>
        <WorkflowRunTimeline />
      </div>
    </div>
  );
};

export default WorkflowRunDetails;
