import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useWorkflowRunRerunValidateModel,
  useWorkflowRunRerunModel,
  useWorkflowRunStateCreateModel,
} from '@/api/workflow';
import { classNames } from '@/utils/commonUtils';
import Skeleton from 'react-loading-skeleton';
import { IconDropdown } from '@/components/common/dropdowns';
import toaster from '@/components/common/toaster';
import { Dialog } from '@/components/common/dialogs';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useWorkflowRunContext } from './WorkflowRunContext';
import { Checkbox } from '@/components/common/checkbox';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { SearchableSelect } from '@/components/common/select';

const WorkflowRunDetailsHeader = () => {
  const { user } = useAuthContext();
  const { orcabusId } = useParams();
  const [isOpenRerunWorkflowDialog, setIsOpenRerunWorkflowDialog] = useState<boolean>(false);
  const { setRefreshWorkflowRuns, workflowRunDetail, isFetchingWorkflowRunDetail } =
    useWorkflowRunContext();

  const [isDeprecated, setIsDeprecated] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  const {
    mutate: rerunWorkflow,
    isSuccess: isRerunWorkflowSuccess,
    isError: isErrorRerunWorkflow,
    reset: resetRerunWorkflow,
    error: rerunWorkflowError,
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
      toaster.error({ title: 'Error rerunning workflow', message: rerunWorkflowError?.message });
      setIsOpenRerunWorkflowDialog(false);
      resetRerunWorkflow();
      setSelectedDataset(null);
      setIsDeprecated(false);
    }
  }, [
    isRerunWorkflowSuccess,
    isErrorRerunWorkflow,
    rerunWorkflowError,
    resetRerunWorkflow,
    setRefreshWorkflowRuns,
  ]);

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
        {/* header: workflow run name */}
        {isFetchingWorkflowRunDetail ? (
          <div className='flex-1'>
            <Skeleton height={20} />
          </div>
        ) : (
          <div className='flex-1 text-lg font-medium'>
            <div className='flex flex-col'>
              <h1 className='truncate text-xl font-semibold text-gray-900 dark:text-white'>
                {workflowRunDetail?.workflowRunName}
              </h1>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Workflow Run Details</p>
            </div>
          </div>
        )}
        {/* workflow run action:  rerun */}
        <div>
          <IconDropdown
            items={[
              {
                label: 'Rerun',
                onClick: () => setIsOpenRerunWorkflowDialog(true),
                disabled: isFetchingWorkflowRunRerunAllowedWorkflows,
              },
            ]}
            className={classNames(
              'inline-flex items-center',
              'rounded-lg border border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-gray-800',
              'text-sm font-medium text-gray-700 dark:text-gray-200',
              'shadow-sm',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
              'transition-all duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            type='square'
          />
        </div>
      </div>

      {/* details */}
      <div className='flex flex-row gap-2 px-2'>
        {/* <div className='flex-1'>
          <JsonToList
            // title='Details'
            data={detailsData}
            isFetchingData={isFetchingWorkflowRunDetail}
          />
        </div> */}

        {/* libraries */}
        {/* <div className='flex-1'>
          <Table
            // tableHeader='Libraries'
            inCard={true}
            columns={librariesTableColumns}
            tableData={librariesTableData}
            isFetchingData={isFetchingWorkflowRunDetail}
          />
        </div> */}
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
                <div className='mx-1 mt-2 flex flex-col gap-1 text-sm'>
                  <div>
                    <div className='mb-1 pt-1 text-xs font-medium'>
                      Please select the dataset to rerun:
                    </div>
                    <div className='w-full max-w-xs py-2'>
                      <SearchableSelect
                        options={workflowRunRerunValidateDetail?.allowedDatasetChoice || []}
                        value={selectedDataset || null}
                        onChange={setSelectedDataset}
                        placeholder='Search datasets...'
                        examples={
                          workflowRunRerunValidateDetail?.allowedDatasetChoice.slice(0, 3) || []
                        }
                      />
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

export default WorkflowRunDetailsHeader;
