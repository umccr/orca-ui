import WorkflowRunTimeline from '../components/workflowRuns/WorkflowRunTimeline';
import WorkflowRunDetailsHeader from '../components/workflowRuns/WorkflowRunDetailsHeader';
import WorkflowRunDetailsSidebar from '../components/workflowRuns/WorkflowRunDetailsSidebar';
import WorkflowRunDetailsLinkage from '../components/workflowRuns/WorkflowRunDetailsLinkage';
import { WorkflowRunProvider } from '../components/workflowRuns/WorkflowRunContext';
import { SideBarLayout } from '@/components/common/sidebar';

const WorkflowRunsDetails = () => {
  return (
    <WorkflowRunProvider>
      <div className='flex h-full w-full'>
        <div className='flex-grow'>
          <SideBarLayout
            main={
              <div className='flex flex-col gap-4'>
                <WorkflowRunDetailsHeader />
                <WorkflowRunDetailsLinkage />
                <WorkflowRunTimeline />
              </div>
            }
            sideBar={<WorkflowRunDetailsSidebar />}
            sideBarPosition='right'
          />
        </div>
      </div>
    </WorkflowRunProvider>
  );
};

export default WorkflowRunsDetails;
