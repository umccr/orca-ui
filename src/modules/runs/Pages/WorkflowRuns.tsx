import { DetailedErrorBoundary } from '@/components/common/error';
import WorkflowRunFilterHeader from '../components/workflowRuns/WorkflowRunFilterHeader';
import WorkflowRunTable from '../components/workflowRuns/WorkflowRunTable';

const WorkflowRuns = () => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load workflow runs data'>
      <div className='h-full w-full'>
        {/* <div className='text-2xl font-bold py-2'>Workflow</div> */}
        {/* workflow run filter header */}
        <WorkflowRunFilterHeader />
        {/* workflow run table */}
        <WorkflowRunTable />
      </div>
    </DetailedErrorBoundary>
  );
};

export default WorkflowRuns;
