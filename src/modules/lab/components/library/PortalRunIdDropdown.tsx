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
    <div className='flex'>
      <div className='flex flex-row flex-wrap content-center font-medium'>
        <Badge type='warning' className='mr-2'>
          <ExclamationTriangleIcon className='mr-2 h-5 w-5' />
          <p className='mt-0.5'>Multiple runs</p>
        </Badge>
        <Dropdown
          floatingLabel='Portal Run ID'
          value={portalRunId}
          items={workflowRunResults.map((i) => ({
            label: i.portalRunId,
            onClick: () => navigate(`../${i.portalRunId}`),
          }))}
        />
      </div>
      {/* In case portalRunId return is beyond the first page, at least some warning as we do not have
      pagination implemented */}
      {workflowRun?.links.next ? (
        <div className='p-4 text-xs italic text-slate-400'>
          *Some portal run id may not be listed.
        </div>
      ) : undefined}
    </div>
  );
};
