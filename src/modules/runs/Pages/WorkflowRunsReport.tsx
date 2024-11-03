import { Button } from '@/components/common/buttons';
import ReportsFilterHeader from '@/modules/runs/components/workflowRunsReports/reportsFilter';
import ReportsContent from '@/modules/runs/components/workflowRunsReports/reportsContent';

const WorkflowRunsReport = () => {
  return (
    <div>
      <div className='flex flex-row justify-between'>
        <div className='text-3xl font-bold py-2'>Workflow Runs Report</div>
        <div>
          <Button>Export</Button>
        </div>
      </div>

      <div>
        <ReportsFilterHeader />
      </div>
      <div>
        <ReportsContent />
      </div>
    </div>
  );
};

export default WorkflowRunsReport;
