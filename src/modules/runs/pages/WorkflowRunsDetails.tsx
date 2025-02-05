import WorkflowRunTimeline from '../components/workflowRuns/WorkflowRunTimeline';
import WorkflowRunDetailsTable from '../components/workflowRuns/WorkflowRunDetailsTable';
import { WorkflowRunProvider } from '../components/workflowRuns/WorkflowRunContext';

const WorkflowRunDetails = () => {
  return (
    <WorkflowRunProvider>
      <div className='flex h-full w-full flex-col gap-4'>
        <WorkflowRunDetailsTable />

        <WorkflowRunTimeline />
      </div>
    </WorkflowRunProvider>
  );
};

export default WorkflowRunDetails;
