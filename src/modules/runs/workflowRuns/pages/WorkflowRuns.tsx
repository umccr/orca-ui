import { DetailedErrorBoundary } from '@/components/common/error';
import MainArea from '@/components/layouts/MainArea';
import WorkflowRunFilterHeader from '../components/WorkflowRunFilterHeader';
import WorkflowRunTable from '../components/WorkflowRunTable';

const WorkflowRuns = () => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load workflow runs data'>
      <MainArea>
        <div className='text-2xl font-bold py-2'>Workflow</div>
        {/* workflow run filter header */}
        <WorkflowRunFilterHeader />
        {/* workflow run table */}
        <WorkflowRunTable />
      </MainArea>
    </DetailedErrorBoundary>
  );
};

export default WorkflowRuns;
