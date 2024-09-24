import { DetailedErrorBoundary } from '@/components/common/error';
import MainArea from '@/components/layouts/MainArea';
import WorkflowRunFilterHeader from '../components/WorkflowRunFilterHeader';
import WorkflowRunTable from '../components/WorkflowRunTable';

const WorkflowRuns = () => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load workflow runs data'>
      <MainArea>
        <div className='text-2xl font-bold'>Workflow</div>
        <WorkflowRunFilterHeader />

        <WorkflowRunTable />
      </MainArea>
    </DetailedErrorBoundary>
  );
};

export default WorkflowRuns;
