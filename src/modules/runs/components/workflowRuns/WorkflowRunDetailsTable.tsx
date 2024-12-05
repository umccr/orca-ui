import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWorkflowRunDetailModel, useWorkflowRunRerunModel } from '@/api/workflow';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import Skeleton from 'react-loading-skeleton';
import { IconDropdown } from '@/components/common/dropdowns';
import toaster from '@/components/common/toaster';
import { Dialog } from '@/components/dialogs';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useWorkflowRunContext } from './WorkflowRunContext';

const WorkflowRunDetailsTable = () => {
  const { orcabusId } = useParams();
  const [isOpenRerunWorkflowDialog, setIsOpenRerunWorkflowDialog] = useState<boolean>(false);
  const { setRefreshWorkflowRuns } = useWorkflowRunContext();

  const { data: workflowRunDetail, isFetching: isFetchingWorkflowRunDetail } =
    useWorkflowRunDetailModel({
      params: { path: { orcabusId: orcabusId as string } },
      reactQuery: {
        enabled: !!orcabusId,
      },
    });

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

  const {
    mutate: rerunWorkflow,
    isSuccess: isRerunWorkflowSuccess,
    isError: isErrorRerunWorkflow,
    reset: resetRerunWorkflow,
  } = useWorkflowRunRerunModel({
    params: { path: { orcabusId: orcabusId as string } },
    body: {},
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const handleRerunWorkflow = () => {
    setIsOpenRerunWorkflowDialog(false);
    rerunWorkflow();
    resetRerunWorkflow();
  };

  useEffect(() => {
    if (isRerunWorkflowSuccess) {
      toaster.success({ title: 'Workflow rerun successfully' });
      setIsOpenRerunWorkflowDialog(false);
      resetRerunWorkflow();
      setRefreshWorkflowRuns(true);
    }
    if (isErrorRerunWorkflow) {
      toaster.error({ title: 'Error rerunning workflow' });
      setIsOpenRerunWorkflowDialog(false);
      resetRerunWorkflow();
    }
  }, [isRerunWorkflowSuccess, isErrorRerunWorkflow, resetRerunWorkflow, setRefreshWorkflowRuns]);

  const librariesTableData = useMemo(
    () =>
      workflowRunDetail && workflowRunDetail.libraries.length > 0
        ? workflowRunDetail.libraries.map((library) => ({
            libraryId: library.libraryId,
            orcabusId: library.orcabusId,
          }))
        : [],
    [workflowRunDetail]
  );

  const librariesTableColumns = useMemo(
    () => [
      {
        header: 'Library ID',
        accessor: 'libraryId',
      },
      {
        header: 'Orcabus ID',
        accessor: 'orcabusId',
        cell: (orcabusId: unknown) => {
          if (!orcabusId) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/lab/library/${orcabusId}`}
                className={classNames('text-sm font-medium hover:text-blue-700 text-blue-500')}
              >
                <div>{orcabusId as string}</div>
              </Link>
            );
          }
        },
      },
    ],
    []
  );

  return (
    <div className='pt-4 w-full flex flex-col gap-2'>
      {/* title */}
      <div className='flex-1 flex flex-row gap-2 items-center px-2'>
        {isFetchingWorkflowRunDetail ? (
          <div className='flex-1'>
            <Skeleton height={20} />
          </div>
        ) : (
          <div className='flex-1 text-lg font-medium'>{workflowRunDetail?.workflowRunName}</div>
        )}
        <div>
          <IconDropdown
            items={[{ label: 'Rerun', onClick: () => setIsOpenRerunWorkflowDialog(true) }]}
            className='bg-magpie-light-50'
          />
        </div>
      </div>

      {/* details */}
      <div className='flex flex-row gap-2 px-2'>
        <div className='flex-1'>
          <JsonToList
            // title='Details'
            data={detailsData}
            isFetchingData={isFetchingWorkflowRunDetail}
          />
        </div>

        {/* libraries */}
        <div className='flex-1'>
          <Table
            // tableHeader='Libraries'
            inCard={true}
            columns={librariesTableColumns}
            tableData={librariesTableData}
            isFetchingData={isFetchingWorkflowRunDetail}
          />
        </div>
      </div>

      <Dialog
        TitleIcon={ArrowPathIcon}
        title='Rerun Workflow'
        open={isOpenRerunWorkflowDialog}
        content={
          <div>
            <div className='text-lg font-medium'>{workflowRunDetail?.workflowRunName || ''}</div>
            <div className='mt-2 text-sm text-red-500'>
              <span className='font-medium'>Note:</span> This action will rerun this workflow and
              mark the current run as &apos;DEPRECATED&apos;.
            </div>
            <div className='mt-2 text-sm text-gray-500 font-medium'>
              Are you sure you want to rerun this workflow?
            </div>
          </div>
        }
        onClose={() => setIsOpenRerunWorkflowDialog(false)}
        closeBtn={{
          label: 'Close',
          onClick: () => setIsOpenRerunWorkflowDialog(false),
        }}
        confirmBtn={{
          label: 'Rerun',
          onClick: handleRerunWorkflow,
        }}
      />
    </div>
  );
};

export default WorkflowRunDetailsTable;
