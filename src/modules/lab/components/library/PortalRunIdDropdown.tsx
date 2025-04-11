import { Dropdown } from '@/components/common/dropdowns';
import { WorkflowRunPaginatedModel } from '@/api/workflow';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/badges';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const PortalRunIdDropdown = ({
  portalRunId,
  workflowRunRes: workflowRun,
}: {
  libraryOrcabusId: string;
  workflowType: string;
  portalRunId: string;
  workflowRunRes: WorkflowRunPaginatedModel;
}) => {
  const navigate = useNavigate();

  const workflowRunResults = workflowRun?.results;
  if (!workflowRunResults?.length) {
    throw new Error('No workflow run found!');
  }

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex items-center space-x-3'>
        <Badge
          type='warning'
          className='inline-flex items-center py-2 text-sm font-medium whitespace-nowrap'
        >
          <ExclamationTriangleIcon className='mr-2 h-5 w-5' />
          <span>Multiple Runs</span>
        </Badge>

        <Dropdown
          floatingLabel='Portal Run ID'
          value={portalRunId}
          items={workflowRunResults.map((i) => ({
            label: i.portalRunId,
            onClick: () => navigate(`../${i.portalRunId}`),
          }))}
          className='min-w-[200px] dark:bg-gray-800 dark:text-gray-200'
        />
      </div>

      {workflowRun?.links.next && (
        <div className='text-xs text-gray-500 italic dark:text-gray-400'>
          * Some portal run IDs may not be listed
        </div>
      )}
    </div>
  );
};
