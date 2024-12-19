import { Dropdown } from '@/components/common/dropdowns';
import { useSuspenseWorkflowRunListModel } from '@/api/workflow';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';
import { Navigate, useNavigate } from 'react-router-dom';

export const PortalRunIdDropdown = ({
  libraryOrcabusId,
  portalRunId,
  workflowType,
}: {
  libraryOrcabusId: string;
  workflowType: string;
  portalRunId?: string;
}) => {
  const navigate = useNavigate();
  const workflowRun = useSuspenseWorkflowRunListModel({
    params: {
      query: {
        libraries__orcabusId: libraryOrcabusId,
        workflow__workflowName: workflowType,
        ordering: '-portalRunId',
        rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE,
      },
    },
  }).data;

  const workflowRunResults = workflowRun?.results;
  if (!workflowRunResults?.length) {
    throw new Error('No workflow run found!');
  }
  if (!portalRunId) {
    return <Navigate to={`${workflowRunResults[0].portalRunId}`} />;
  }

  // If portalRunId is not found in the list of workflowRun, it is invalid link
  if (!workflowRunResults.find((i) => i.portalRunId === portalRunId)) {
    throw new Error('Invalid link!');
  }

  return (
    <div className='flex '>
      <div className='flex flex-row font-medium flex-wrap content-center'>
        <Dropdown
          floatingLabel='Portal Run Id'
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
        <div className='p-4 text-slate-400 text-xs italic'>
          *Some portal run id may not be listed.
        </div>
      ) : undefined}
    </div>
  );
};
