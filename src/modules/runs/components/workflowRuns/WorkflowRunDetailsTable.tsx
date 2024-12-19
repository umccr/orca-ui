import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useWorkflowRunDetailModel,
  useWorkflowRunRerunValidateModel,
  useWorkflowRunRerunModel,
  useWorkflowRunStateCreateModel,
} from '@/api/workflow';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import Skeleton from 'react-loading-skeleton';
import { IconDropdown } from '@/components/common/dropdowns';
import toaster from '@/components/common/toaster';
import { Dialog } from '@/components/common/dialogs';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useWorkflowRunContext } from './WorkflowRunContext';
import { Checkbox } from '@/components/common/checkbox';
import { useAuthContext } from '@/context/AmplifyAuthContext';

const WorkflowRunDetailsTable = () => {
  const { user } = useAuthContext();
  const { orcabusId } = useParams();
  const [isOpenRerunWorkflowDialog, setIsOpenRerunWorkflowDialog] = useState<boolean>(false);
  const { setRefreshWorkflowRuns } = useWorkflowRunContext();

  const [isDeprecated, setIsDeprecated] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  const { data: workflowRunDetail, isFetching: isFetchingWorkflowRunDetail } =
    useWorkflowRunDetailModel({
      params: { path: { orcabusId: (orcabusId as string).split('.')[1] } },
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
    body: {
      dataset: selectedDataset,
    },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const {
    data: workflowRunRerunValidateDetail,
    isFetching: isFetchingWorkflowRunRerunAllowedWorkflows,
  } = useWorkflowRunRerunValidateModel({
    params: { path: { orcabusId: (orcabusId as string).split('.')[1] } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const handleRerunWorkflow = () => {
    rerunWorkflow();
    if (isDeprecated) {
      handleMarkAsDeprecated();
    }
    setIsOpenRerunWorkflowDialog(false);
  };

  useEffect(() => {
    if (isRerunWorkflowSuccess) {
      toaster.success({ title: 'Workflow rerun successfully' });
      setIsOpenRerunWorkflowDialog(false);
      resetRerunWorkflow();
      setRefreshWorkflowRuns(true);
      setSelectedDataset(null);
      setIsDeprecated(false);
    }
    if (isErrorRerunWorkflow) {
      toaster.error({ title: 'Error rerunning workflow' });
      setIsOpenRerunWorkflowDialog(false);
      resetRerunWorkflow();
      setSelectedDataset(null);
      setIsDeprecated(false);
    }
  }, [isRerunWorkflowSuccess, isErrorRerunWorkflow, resetRerunWorkflow, setRefreshWorkflowRuns]);

  const {
    mutate: createWorkflowRunState,
    isSuccess: isCreatedWorkflowRunState,
    isError: isErrorCreatingWorkflowRunState,
    reset: resetCreateWorkflowRunState,
  } = useWorkflowRunStateCreateModel({
    params: { path: { orcabusId: orcabusId?.split('.')[1] as string } },
    body: {
      status: 'DEPRECATED',
      comment: 'Workflow run marked as DEPRECATED as rerun this workflow',
      createdBy: user?.email,
    },
  });

  const handleMarkAsDeprecated = () => {
    createWorkflowRunState();
  };

  useEffect(() => {
    if (isCreatedWorkflowRunState) {
      toaster.success({ title: 'Workflow run marked as DEPRECATED' });
      resetCreateWorkflowRunState();
    }
    if (isErrorCreatingWorkflowRunState) {
      toaster.error({ title: 'Error marking workflow run as DEPRECATED' });
      resetCreateWorkflowRunState();
    }
  }, [isCreatedWorkflowRunState, resetCreateWorkflowRunState, isErrorCreatingWorkflowRunState]);

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
                className={classNames('text-sm font-medium text-blue-500 hover:text-blue-700')}
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

  const handleCloseRerunWorkflowDialog = () => {
    setIsOpenRerunWorkflowDialog(false);
    resetRerunWorkflow();
    setSelectedDataset(null);
    setIsDeprecated(false);
  };

  return (
    <div className='flex w-full flex-col gap-2 pt-4'>
      {/* title */}
      <div className='flex flex-1 flex-row items-center gap-2 px-2'>
        {isFetchingWorkflowRunDetail ? (
          <div className='flex-1'>
            <Skeleton height={20} />
          </div>
        ) : (
          <div className='flex-1 text-lg font-medium'>{workflowRunDetail?.workflowRunName}</div>
        )}
        <div>
          <IconDropdown
            items={[
              {
                label: 'Rerun',
                onClick: () => setIsOpenRerunWorkflowDialog(true),
                disabled: isFetchingWorkflowRunRerunAllowedWorkflows,
              },
            ]}
            className='hover:text-magpie-light-500 bg-magpie-light-50'
            type='square'
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

            {!workflowRunRerunValidateDetail?.isValid ? (
              <div className='mt-2 flex flex-col gap-1 text-sm'>
                <div className='flex flex-row gap-1 text-red-500'>
                  <span className='font-medium'>Warning:</span>
                  <span>This workflow is not allowed to rerun.</span>
                </div>
                <div className='flex flex-row gap-1 text-gray-500'>
                  <span className='font-medium'>Reason:</span>
                  <span>
                    Current workflow is not in the allowed workflows:{' '}
                    {workflowRunRerunValidateDetail?.validWorkflows.join(', ')}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className='mt-2 flex flex-col gap-1 text-sm'>
                  <div>
                    <div className='mb-1 pt-1 text-xs font-medium'>
                      Please select the dataset to rerun:
                    </div>
                    <div className='flex flex-wrap gap-1'>
                      {workflowRunRerunValidateDetail?.allowedDatasetChoice.map((dataset, idx) => (
                        <label
                          key={idx}
                          className={classNames(
                            'flex cursor-pointer items-center rounded-md border px-2 py-1 transition-colors',
                            'hover:bg-gray-50',
                            selectedDataset === dataset
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200'
                          )}
                        >
                          <input
                            type='radio'
                            name='dataset'
                            value={dataset}
                            checked={selectedDataset === dataset}
                            onChange={() => setSelectedDataset(dataset)}
                            className='h-3 w-3 border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                          <span className='ml-1 text-xs font-medium'>{dataset}</span>
                        </label>
                      ))}
                    </div>
                    {!selectedDataset && (
                      <div className='text-xs text-red-500'>Please select a dataset.</div>
                    )}
                  </div>
                  <div className='my-2 h-px bg-gray-200'></div>
                  <div>
                    <Checkbox
                      className='flex flex-row gap-2 text-sm font-medium'
                      checked={isDeprecated}
                      onChange={() => setIsDeprecated(!isDeprecated)}
                      disabled={
                        !selectedDataset || workflowRunDetail?.workflow.workflowName !== 'RNASUM'
                      }
                      label="Mark the current run as 'DEPRECATED'."
                    />

                    {workflowRunDetail?.workflow.workflowName !== 'RNASUM' ? (
                      <div className='text-xs text-red-500'>
                        This feature is not available for RNASUM workflow.
                      </div>
                    ) : (
                      <div>
                        <div className='text-xs text-gray-500'>
                          This action will mark the current run as &apos;DEPRECATED&apos;, and is
                          irreversible.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='mt-2 pt-2 text-sm font-medium text-red-500'>
                  Are you sure you want to rerun this workflow?
                </div>
              </>
            )}
          </div>
        }
        onClose={handleCloseRerunWorkflowDialog}
        closeBtn={{
          label: 'Close',
          onClick: handleCloseRerunWorkflowDialog,
        }}
        confirmBtn={{
          label: 'Rerun',
          onClick: handleRerunWorkflow,
          disabled:
            isFetchingWorkflowRunRerunAllowedWorkflows ||
            !workflowRunRerunValidateDetail?.isValid ||
            !selectedDataset,
        }}
      />
    </div>
  );
};

export default WorkflowRunDetailsTable;
