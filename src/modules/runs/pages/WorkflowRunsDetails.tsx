import WorkflowRunTimeline from '../components/workflowRuns/WorkflowRunTimeline';
import WorkflowRunDetailsHeader from '../components/workflowRuns/WorkflowRunDetailsHeader';
import WorkflowRunDetailsSidebar from '../components/workflowRuns/WorkflowRunDetailsSidebar';
import WorkflowRunDetailsLinkage from '../components/workflowRuns/WorkflowRunDetailsLinkage';
import { WorkflowRunProvider } from '../components/workflowRuns/WorkflowRunContext';

const WorkflowRunsDetails = () => {
  return (
    <WorkflowRunProvider>
      <div className='flex h-full w-full flex-row gap-4'>
        <div className='mt-4 flex h-full flex-col gap-4'>
          <WorkflowRunDetailsHeader />

          <WorkflowRunDetailsLinkage />
          <WorkflowRunTimeline />
        </div>
        <div className='flex h-full'>
          <WorkflowRunDetailsSidebar />
        </div>
      </div>
    </WorkflowRunProvider>
  );
};

export default WorkflowRunsDetails;
