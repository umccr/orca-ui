import { FC } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@/components/common/dialogs';
import { SearchableSelect } from '@/components/common/select';
import { Checkbox } from '@/components/common/checkbox';
import type { WorkflowRunRerunValidateDetailModel } from '@/api/workflow';

interface RerunDialogProps {
  isOpenRerunWorkflowDialog: boolean;
  workflowRunName: string;
  workflowName: string;
  workflowRunRerunValidateDetail: WorkflowRunRerunValidateDetailModel | null;
  selectedDataset: string;
  setSelectedDataset: (dataset: string) => void;
  isDeprecated: boolean;
  setIsDeprecated: (isDeprecated: boolean) => void;
  handleCloseRerunWorkflowDialog: () => void;
  handleRerunWorkflow: () => void;
  isFetchingWorkflowRunRerunAllowedWorkflows: boolean;
}

const RerunDialog: FC<RerunDialogProps> = ({
  isOpenRerunWorkflowDialog,
  workflowRunName,
  workflowName,
  workflowRunRerunValidateDetail,
  selectedDataset,
  setSelectedDataset,
  isDeprecated,
  setIsDeprecated,
  handleCloseRerunWorkflowDialog,
  handleRerunWorkflow,
  isFetchingWorkflowRunRerunAllowedWorkflows,
}) => {
  return (
    <Dialog
      TitleIcon={ArrowPathIcon}
      title='Rerun Workflow'
      open={isOpenRerunWorkflowDialog}
      content={
        <div>
          <div className='text-lg font-medium'>{workflowRunName || ''}</div>

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
                    disabled={!selectedDataset || workflowName !== 'RNASUM'}
                    label="Mark the current run as 'DEPRECATED'."
                  />

                  {workflowName !== 'RNASUM' ? (
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
  );
};

export default RerunDialog;
