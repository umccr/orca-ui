import { Suspense } from 'react';
import { PortalRunIdDropdown } from '../../components/library/PortalRunIdDropdown';
import { Navigate, useParams } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';
import { FileAPITable, getTableColumn, SearchBox } from '@/modules/files/components/FileAPITable';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useSuspenseWorkflowRunListModel } from '@/api/workflow';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';
import { WorkflowDialogDetail } from '../../components/library/WorkflowDialogDetail';

export default function LibraryWorkflowPage() {
  const { libraryOrcabusId, portalRunId, workflowType } = useParams();
  const { setQueryParams, getQueryParams } = useQueryParams();
  const searchKey = getQueryParams().key ?? '';

  if (!libraryOrcabusId || !workflowType) {
    throw new Error('Invalid URL!');
  }

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
  const currentWorkflowRunDetail = workflowRunResults.find((i) => i.portalRunId === portalRunId);
  if (!currentWorkflowRunDetail) {
    throw new Error('Invalid link!');
  }

  const isMultipleRuns = workflowRunResults.length > 1;

  return (
    <div>
      {/* Header */}
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row'>
          <h1 className='flex h-full items-center font-bold'>{`${workflowType}`}</h1>
          <WorkflowDialogDetail
            portalRunId={portalRunId}
            workflowDetail={currentWorkflowRunDetail}
          />
        </div>

        {isMultipleRuns && (
          <div className='flex flex-row'>
            <PortalRunIdDropdown
              workflowType={workflowType}
              portalRunId={portalRunId}
              libraryOrcabusId={libraryOrcabusId}
              workflowRunRes={workflowRun}
            />
          </div>
        )}
      </div>

      {/* Body */}
      {portalRunId && (
        <Suspense fallback={<SpinnerWithText text='Fetching related files ...' />}>
          <div className='mt-2 flex flex-col gap-2'>
            <SearchBox
              initValue={searchKey}
              placeholder='S3 key pattern search (wildcard supported)'
              onSearch={(s) => {
                setQueryParams({ key: s });
              }}
              searchInfoText='The search matches values within S3 keys. Use an asterisk (*) as a wildcard to match any sequence of characters. An asterisk is added at the beginning and end of the search term.'
            />
            <FileAPITable
              additionalQueryParam={{
                'attributes[portalRunId]': portalRunId,
                key: `*${searchKey}*`,
              }}
              tableColumn={getTableColumn({ isHideKeyPrefix: true })}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}
