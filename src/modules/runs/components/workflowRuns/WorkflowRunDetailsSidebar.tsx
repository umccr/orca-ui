import { useMemo } from 'react';
import { JsonToTable } from '@/components/common/json-to-table';
import { useWorkflowRunContext } from './WorkflowRunContext';
import { Sidebar } from '@/components/common/sidebar';

const WorkflowRunDetailsSidebar = () => {
  const { workflowRunDetail } = useWorkflowRunContext();
  // format data and disply in the table
  const detailsData = useMemo(
    () =>
      workflowRunDetail
        ? {
            workflowName: workflowRunDetail.workflow.workflowName,
            portalRunId: workflowRunDetail.portalRunId,
            executionId: workflowRunDetail.executionId || '-',
            excutionEngine: workflowRunDetail.workflow.executionEngine,
            workflowType:
              workflowRunDetail.workflow.workflowName +
              '  v' +
              workflowRunDetail.workflow.workflowVersion,
            timestamp: (workflowRunDetail.currentState.timestamp as string) || '-',
            comments: workflowRunDetail.comment || '-',
          }
        : null,
    [workflowRunDetail]
  );

  return (
    <Sidebar
      position='right'
      className='border-r-0'
      preferenceStorageKey='workflow-run-details-sidebar'
    >
      <div className='mt-20'>
        {detailsData && (
          <JsonToTable
            data={detailsData as Record<string, string | number | boolean | null>}
            //isFetchingData={isFetchingWorkflowRunDetail}
          />
        )}
      </div>
    </Sidebar>
  );
};

export default WorkflowRunDetailsSidebar;
