import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useWorkflowRunRerunValidateModel,
  useWorkflowRunRerunModel,
  useWorkflowRunStateCreateModel,
  useWorkflowRunStateValidMapModel,
  useWorkflowRunCommentCreateModel,
} from '@/api/workflow';
import Skeleton from 'react-loading-skeleton';
import toaster from '@/components/common/toaster';
import { useWorkflowRunContext } from './WorkflowRunContext';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { Button } from '@/components/common/buttons';
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import RerunDialog from '../common/RerunDialog';
import CommentDialog from '../common/CommentDialog';
import StatesDialog from '../common/StatesDialog';
import { classNames } from '@/utils/commonUtils';

const WorkflowRunDetailsHeader = () => {
  const { user } = useAuthContext();
  const { orcabusId } = useParams();
  const {
    setRefreshWorkflowRuns,
    workflowRunDetail,
    isFetchingWorkflowRunDetail,
    refetchWorkflowComment,
    refetchWorkflowState,
  } = useWorkflowRunContext();

  // rerun workflow dialog
  const [isOpenRerunWorkflowDialog, setIsOpenRerunWorkflowDialog] = useState<boolean>(false);
  const [isDeprecated, setIsDeprecated] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  // comment dialog
  const [isOpenAddCommentDialog, setIsOpenAddCommentDialog] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  // state dialog
  const [isOpenAddStateDialog, setIsOpenAddStateDialog] = useState<boolean>(false);
  const [stateStatus, setStateStatus] = useState<string | null>(null);
  const [stateComment, setStateComment] = useState<string>('');

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

  const { data: workflowRunStateValidMapData } = useWorkflowRunStateValidMapModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const workflowLastState = workflowRunDetail?.currentState?.status;

  // check if the last state is valid for state creation
  const isValidCreateState = Object.entries(workflowRunStateValidMapData || {}).some(([, value]) =>
    (value as string[]).includes(workflowLastState as string)
  );
  // find all valid state key who has vale of workflowLastState
  const validState = Object.entries(workflowRunStateValidMapData || {})
    .filter(([, value]) => (value as string[]).includes(workflowLastState as string))
    .map(([key]) => key);

  const {
    mutate: createWorkflowRunComment,
    isSuccess: isCreatedWorkflowRunComment,
    isError: isErrorCreatingWorkflowRunComment,
    reset: resetCreateWorkflowRunComment,
  } = useWorkflowRunCommentCreateModel({
    params: { path: { orcabusId: orcabusId as string } },
    body: {
      comment: comment,
      createdBy: user?.email,
    },
  });

  const handleAddComment = () => {
    createWorkflowRunComment();
    setIsOpenAddCommentDialog(false);
  };

  useEffect(() => {
    if (isCreatedWorkflowRunComment) {
      toaster.success({ title: 'Comment added successfully' });
      refetchWorkflowComment();
      resetCreateWorkflowRunComment();
      setComment('');
    }

    if (isErrorCreatingWorkflowRunComment) {
      toaster.error({ title: 'Error adding comment' });
      resetCreateWorkflowRunComment();
    }
  }, [
    isCreatedWorkflowRunComment,
    isErrorCreatingWorkflowRunComment,
    refetchWorkflowComment,
    resetCreateWorkflowRunComment,
  ]);

  const {
    mutate: createWorkflowRunState,
    isSuccess: isCreatedWorkflowRunState,
    isError: isErrorCreatingWorkflowRunState,
    reset: resetCreateWorkflowRunState,
  } = useWorkflowRunStateCreateModel({
    params: { path: { orcabusId: orcabusId as string } },
    body: {
      status: stateStatus,
      comment: stateComment,
      createdBy: user?.email,
    },
  });

  const handleStateCreationEvent = () => {
    createWorkflowRunState();
    setIsOpenAddStateDialog(false);
  };
  useEffect(() => {
    if (isCreatedWorkflowRunState) {
      toaster.success({ title: 'State added' });
      refetchWorkflowState();
      resetCreateWorkflowRunState();
      setStateComment('');
    }

    if (isErrorCreatingWorkflowRunState) {
      toaster.error({ title: 'Error adding state status' });
      resetCreateWorkflowRunState();
    }
  }, [
    isCreatedWorkflowRunState,
    refetchWorkflowState,
    resetCreateWorkflowRunState,
    isErrorCreatingWorkflowRunState,
  ]);

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

  const handleMarkAsDeprecated = () => {
    createWorkflowRunState();
  };

  useEffect(() => {
    if (isCreatedWorkflowRunState) {
      toaster.success({ title: `Workflow run marked as ${stateStatus}` });
      resetCreateWorkflowRunState();
    }
    if (isErrorCreatingWorkflowRunState) {
      toaster.error({ title: `Error marking workflow run as ${stateStatus}` });
      resetCreateWorkflowRunState();
    }
  }, [
    isCreatedWorkflowRunState,
    resetCreateWorkflowRunState,
    isErrorCreatingWorkflowRunState,
    stateStatus,
  ]);

  const handleCloseRerunWorkflowDialog = () => {
    setIsOpenRerunWorkflowDialog(false);
    resetRerunWorkflow();
    setSelectedDataset(null);
    setIsDeprecated(false);
  };

  return (
    <div className={classNames('flex w-full flex-col gap-3', 'bg-white dark:bg-gray-800')}>
      {/* title */}

      {/* header: workflow run name */}
      {isFetchingWorkflowRunDetail ? (
        <div className='flex-1'>
          <Skeleton height={20} />
        </div>
      ) : (
        <div>
          <div className='flex items-center justify-between pt-4'>
            <div className='flex flex-col'>
              <h1 className='truncate text-xl font-semibold text-gray-900 dark:text-white'>
                {workflowRunDetail?.workflowRunName}
              </h1>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Workflow Run Actions</p>
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2 p-4'>
            <Button
              type='gray'
              size='xs'
              rounded
              onClick={() => setIsOpenRerunWorkflowDialog(true)}
              disabled={isFetchingWorkflowRunRerunAllowedWorkflows}
              className={classNames(
                'flex items-center gap-2',
                'border border-gray-200 dark:border-gray-700',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'rounded-lg px-4 py-2',
                'shadow-sm'
              )}
            >
              <PlusIcon className='h-4 w-4' />
              Rerun
            </Button>
            <Button
              type='gray'
              size='xs'
              rounded
              onClick={() => setIsOpenAddCommentDialog(true)}
              className={classNames(
                'flex items-center gap-2',
                'border border-gray-200 dark:border-gray-700',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'rounded-lg px-4 py-2',
                'shadow-sm'
              )}
            >
              <ChatBubbleLeftRightIcon className='h-4 w-4' />
              Add Comment
            </Button>

            {isValidCreateState && (
              <Button
                type='gray'
                size='xs'
                rounded
                onClick={() => setIsOpenAddStateDialog(true)}
                className={classNames(
                  'flex items-center gap-2',
                  'border border-gray-200 dark:border-gray-700',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'rounded-lg px-4 py-2',
                  'shadow-sm'
                )}
              >
                <PlusIcon className='h-4 w-4' />
                Add New State
              </Button>
            )}
          </div>
        </div>
      )}

      <RerunDialog
        isOpenRerunWorkflowDialog={isOpenRerunWorkflowDialog}
        workflowRunName={workflowRunDetail?.workflowRunName || ''}
        workflowName={workflowRunDetail?.workflow.workflowName || ''}
        workflowRunRerunValidateDetail={workflowRunRerunValidateDetail || null}
        selectedDataset={selectedDataset || ''}
        setSelectedDataset={setSelectedDataset}
        isDeprecated={isDeprecated}
        setIsDeprecated={setIsDeprecated}
        handleCloseRerunWorkflowDialog={handleCloseRerunWorkflowDialog}
        handleRerunWorkflow={handleRerunWorkflow}
        isFetchingWorkflowRunRerunAllowedWorkflows={isFetchingWorkflowRunRerunAllowedWorkflows}
      />
      {/* comment dialog */}
      <CommentDialog
        isOpenAddCommentDialog={isOpenAddCommentDialog}
        isOpenUpdateCommentDialog={false}
        isOpenDeleteCommentDialog={false}
        comment={comment}
        setComment={setComment}
        handleClose={() => {
          setIsOpenAddCommentDialog(false);
          setComment('');
        }}
        handleAddComment={handleAddComment}
        handleUpdateComment={() => {}}
        handleDeleteComment={() => {}}
        user={user}
      />
      {/* state dialog */}
      <StatesDialog
        isOpenAddStateDialog={isOpenAddStateDialog}
        isOpenUpdateStateDialog={false}
        user={user}
        validState={validState}
        stateStatus={stateStatus}
        setStateStatus={setStateStatus}
        selectedState={null}
        currentState={null}
        handleClose={() => {
          setIsOpenAddStateDialog(false);
        }}
        stateComment={stateComment}
        setStateComment={setStateComment}
        handleStateCreationEvent={handleStateCreationEvent}
        handleUpdateState={() => {}}
      />
    </div>
  );
};

export default WorkflowRunDetailsHeader;
