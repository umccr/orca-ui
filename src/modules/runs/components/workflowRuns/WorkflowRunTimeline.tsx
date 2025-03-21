import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Timeline } from '@/components/common/timelines';
import type { TimelineEvent } from '@/components/common/timelines';
import { ContentTabs } from '@/components/navigation/tabs';
import { JsonToNestedList, JsonDisplay } from '@/components/common/json-to-table';
import {
  useWorkflowPayloadModel,
  useWorkflowRunCommentUpdateModel,
  useWorkflowRunCommentDeleteModel,
  useWorkflowRunStateUpdateModel,
  useWorkflowRunStateValidMapModel,
} from '@/api/workflow';
import { keepPreviousData } from '@tanstack/react-query';
import {
  TrashIcon,
  EyeSlashIcon,
  EyeIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import toaster from '@/components/common/toaster';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { Badge } from '@/components/common/badges';
import { getBadgeStatusType, statusBackgroundColor } from '@/utils/statusUtils';
import { dayjs } from '@/utils/dayjs';
import { classNames, getUsername } from '@/utils/commonUtils';
import { BackdropWithText } from '@/components/common/backdrop';
import { useWorkflowRunContext } from './WorkflowRunContext';
import { Button } from '@/components/common/buttons';
import CommentDialog from '../common/CommentDialog';
import StatesDialog from '../common/StatesDialog';
import { Accordion } from '@/components/common/accordion';

const WorkflowRunTimeline = () => {
  const { orcabusId } = useParams();
  const { user } = useAuthContext();
  const {
    refreshWorkflowRuns,
    setRefreshWorkflowRuns,
    workflowStateData,
    refetchWorkflowState,
    workflowCommentData,
    refetchWorkflowComment,
    isFetchingWorkflowState,
    isFetchingWorkflowComment,
  } = useWorkflowRunContext();
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [selectedPayloadId, setSelectedPayloadId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const [isOpenUpdateCommentDialog, setIsOpenUpdateCommentDialog] = useState<boolean>(false);
  const [isOpenDeleteCommentDialog, setIsOpenDeleteCommentDialog] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  const [isReverseOrder, setIsReverseOrder] = useState<boolean>(false);

  const [isOpenUpdateStateDialog, setIsOpenUpdateStateDialog] = useState<boolean>(false);
  const [stateStatus, setStateStatus] = useState<string | null>(null);
  const [stateId, setStateId] = useState<string | null>(null);
  const [stateComment, setStateComment] = useState<string>('');

  const [showPayload, setShowPayload] = useState(false);

  useEffect(() => {
    if (refreshWorkflowRuns) {
      refetchWorkflowState();
      setRefreshWorkflowRuns(false);
    }
  }, [refreshWorkflowRuns, refetchWorkflowState, setRefreshWorkflowRuns]);

  const { data: workflowRunStateValidMapData } = useWorkflowRunStateValidMapModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const workflowLastState = workflowStateData?.[workflowStateData.length - 1]?.status;

  // find all valid state key who has vale of workflowLastState
  const validState = Object.entries(workflowRunStateValidMapData || {})
    .filter(([, value]) => (value as string[]).includes(workflowLastState || ''))
    .map(([key]) => key);

  const workflowStateTimelineData = useMemo(
    () =>
      workflowStateData
        ? workflowStateData.map((state) => ({
            id: state.orcabusId as string,
            title: 'Workflow State Update',
            actionsList: Object.keys(workflowRunStateValidMapData || {}).includes(state.status)
              ? [
                  {
                    label: 'Edit',
                    icon: PencilIcon,
                    onClick: () => {
                      setStateId(state.orcabusId as string);
                      setStateComment(state.comment || '');
                      setIsOpenUpdateStateDialog(true);
                    },
                  },
                ]
              : [],
            datetime: state.timestamp,
            comment: state.comment || '',
            status: state.status,
            iconBackground: statusBackgroundColor(getBadgeStatusType(state.status)),
            payloadId: state?.payload || '',
            eventType: 'stateChange' as const,
          }))
        : [],
    [workflowStateData, workflowRunStateValidMapData]
  );

  const workflowCommentTimelineData = useMemo(
    () =>
      workflowCommentData
        ? workflowCommentData.map((comment) => ({
            id: comment.orcabusId as string,
            title: 'Comment Added',
            datetime: comment.updatedAt,
            iconBackground: 'bg-blue-100 dark:bg-blue-900',
            comment: comment.comment,
            actionsList: [
              {
                label: 'Edit',
                icon: PencilIcon,
                onClick: () => {
                  setCommentId(comment.orcabusId as string);
                  setComment(comment.comment);
                  setIsOpenUpdateCommentDialog(true);
                },
              },
              {
                label: 'Delete',
                icon: TrashIcon,
                onClick: () => {
                  setCommentId(comment.orcabusId as string);
                  setIsOpenDeleteCommentDialog(true);
                },
              },
            ],
            eventType: 'comment' as const,
            user: {
              name: getUsername(comment.createdBy || ''),
              // Optional: Add avatar if available
              // avatar: getUserAvatar(comment.createdBy)
            },
          }))
        : [],
    [workflowCommentData]
  );

  const workflowRuntimelineData = [
    ...workflowStateTimelineData,
    ...workflowCommentTimelineData,
  ].sort((a, b) => (dayjs(a.datetime).isAfter(dayjs(b.datetime)) ? -1 : 1));

  useEffect(() => {
    if (workflowStateTimelineData.length > 0) {
      setCurrentState(workflowStateTimelineData[0].status);
      setSelectedPayloadId(workflowStateTimelineData[0].payloadId);
    }
  }, [workflowStateTimelineData]);

  const { data: selectedWorkflowPayloadData, isFetching } = useWorkflowPayloadModel({
    params: { path: { id: selectedPayloadId || '' } },
    reactQuery: {
      enabled: !!selectedPayloadId,
      placeholderData: keepPreviousData,
    },
  });

  const handleTimelineSelect = (event: TimelineEvent) => {
    if (event.eventType !== 'stateChange') return;

    // Update state and show payload for new selection
    setSelectedPayloadId(event.payloadId || null);
    setSelectedState(event.status || null);
    // setShowPayload(true);
  };

  const {
    mutate: updateWorkflowRunComment,
    isSuccess: isUpdatedWorkflowRunComment,
    isError: isErrorUpdatingWorkflowRunComment,
    reset: resetUpdateWorkflowRunComment,
  } = useWorkflowRunCommentUpdateModel({
    params: {
      path: {
        orcabusId: orcabusId as string,
        id: commentId as string,
      },
    },
    body: {
      comment: comment,
      createdBy: user?.email,
    },
    reactQuery: {
      enabled: !!commentId,
    },
  });

  const handleUpdateComment = () => {
    updateWorkflowRunComment();
    setIsOpenUpdateCommentDialog(false);
  };

  useEffect(() => {
    if (isUpdatedWorkflowRunComment) {
      toaster.success({ title: 'Comment updated successfully' });
      refetchWorkflowComment();
      resetUpdateWorkflowRunComment();
      setComment('');
    }

    if (isErrorUpdatingWorkflowRunComment) {
      toaster.error({ title: 'Error updating comment' });
      resetUpdateWorkflowRunComment();
    }
  }, [
    isUpdatedWorkflowRunComment,
    refetchWorkflowComment,
    resetUpdateWorkflowRunComment,
    isErrorUpdatingWorkflowRunComment,
  ]);

  const {
    mutate: deleteWorkflowRunComment,
    isSuccess: isDeletedWorkflowRunComment,
    isError: isErrorDeletingWorkflowRunComment,
    reset: resetDeleteWorkflowRunComment,
  } = useWorkflowRunCommentDeleteModel({
    params: {
      path: {
        orcabusId: orcabusId as string,
        id: commentId as string,
      },
    },
    body: {
      createdBy: user?.email,
    },
  });

  const handleDeleteComment = () => {
    deleteWorkflowRunComment();
    setIsOpenDeleteCommentDialog(false);
  };

  useEffect(() => {
    if (isDeletedWorkflowRunComment) {
      toaster.success({ title: 'Comment deleted successfully' });
      refetchWorkflowComment();
      resetDeleteWorkflowRunComment();
      setComment('');
    }

    if (isErrorDeletingWorkflowRunComment) {
      toaster.error({ title: 'Error deleting comment' });
      resetDeleteWorkflowRunComment();
    }
  }, [
    isDeletedWorkflowRunComment,
    refetchWorkflowComment,
    resetDeleteWorkflowRunComment,
    isErrorDeletingWorkflowRunComment,
  ]);

  const {
    mutate: updateWorkflowRunState,
    isSuccess: isUpdatedWorkflowRunState,
    isError: isErrorUpdatingWorkflowRunState,
    reset: resetUpdateWorkflowRunState,
  } = useWorkflowRunStateUpdateModel({
    params: {
      path: {
        orcabusId: orcabusId as string,
        id: stateId as string,
      },
    },
    body: {
      comment: stateComment,
    },
  });

  const handleUpdateState = () => {
    updateWorkflowRunState();
    setIsOpenUpdateStateDialog(false);
  };

  useEffect(() => {
    if (isUpdatedWorkflowRunState) {
      toaster.success({ title: 'State updated successfully' });
      refetchWorkflowState();
      resetUpdateWorkflowRunState();
      setStateComment('');
    }

    if (isErrorUpdatingWorkflowRunState) {
      toaster.error({ title: 'Error updating state' });
      resetUpdateWorkflowRunState();
    }
  }, [
    isUpdatedWorkflowRunState,
    refetchWorkflowState,
    resetUpdateWorkflowRunState,
    isErrorUpdatingWorkflowRunState,
  ]);

  // Create a PayloadContent component for the drawer
  const PayloadContent = ({
    selectedState,
    currentState,
  }: {
    selectedState: string;
    currentState: string;
  }) => (
    <div className='flex flex-col space-y-4 px-2'>
      {/* State Badge Card */}
      <div
        className={classNames(
          'flex items-center gap-3 rounded-lg p-3',
          'bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-800/50'
        )}
      >
        <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
          {selectedState ? 'Selected State' : 'Current State'}:
        </span>
        <Badge status={selectedState || currentState || 'unknown'} className='shadow-sm'>
          {selectedState || currentState || 'unknown'}
        </Badge>
      </div>

      {/* Content Section */}
      <div className='flex flex-col space-y-1 rounded-lg'>
        <ContentTabs
          className='rounded-lg bg-white bg-gradient-to-r from-gray-50/80 to-white shadow-sm dark:bg-gray-900 dark:from-gray-800/80 dark:to-gray-800/50'
          tabs={[
            {
              label: 'Payload Data',
              content: (
                <div className='flex flex-col gap-3 p-2'>
                  {Object.entries(selectedWorkflowPayloadData?.data as Record<string, unknown>).map(
                    ([key, value]) => (
                      <Accordion
                        key={key}
                        title={key}
                        defaultOpen={true}
                        chevronPosition='right'
                        className={classNames(
                          'overflow-hidden rounded-lg',
                          'bg-gradient-to-r from-white to-gray-50/50',
                          'dark:from-gray-900 dark:to-gray-800/50',
                          'shadow-sm hover:shadow-md',
                          'transition-all duration-200 ease-in-out',
                          'group'
                        )}
                        buttonClassName={classNames(
                          'border-0',
                          'bg-gradient-to-r from-gray-50/80 to-transparent',
                          'dark:from-gray-800/80 dark:to-transparent',
                          'group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20',
                          'transition-all duration-300'
                        )}
                      >
                        <div className='divide-y divide-gray-100 bg-white/50 dark:divide-gray-800 dark:bg-gray-900/50'>
                          <JsonToNestedList
                            data={value as Record<string, unknown>}
                            isURIIncluded={true}
                            isFetchingData={isFetching}
                            inCard={false}
                            className='space-y-0'
                            listClassName='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200'
                          />
                        </div>
                      </Accordion>
                    )
                  )}
                </div>
              ),
            },
            {
              label: 'JSON View',
              content: (
                <div
                  className={classNames(
                    'rounded-lg p-4',
                    'bg-gray-50/50 dark:bg-gray-800/50',
                    'font-mono text-sm'
                  )}
                >
                  <JsonDisplay
                    data={selectedWorkflowPayloadData as Record<string, unknown>}
                    isFetchingData={isFetching}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div>
      {(isFetchingWorkflowState || isFetchingWorkflowComment) && (
        <BackdropWithText text='Loading Timeline data...' />
      )}
      <div className='flex flex-col gap-1 pb-4'>
        {/* timeline header part */}
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Timeline</h2>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {workflowRuntimelineData.length} events
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              type='gray'
              size='xs'
              rounded
              onClick={() => setShowPayload(!showPayload)}
              className={classNames(
                'flex items-center gap-2',
                'border border-gray-200 dark:border-gray-700',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'rounded-lg px-4 py-2',
                'shadow-sm'
              )}
            >
              {showPayload ? <EyeSlashIcon className='h-4 w-4' /> : <EyeIcon className='h-4 w-4' />}
              {showPayload ? 'Hide Payload' : 'Show Payload'}
            </Button>
            <Button
              type='gray'
              size='xs'
              onClick={() => setIsReverseOrder(!isReverseOrder)}
              className={classNames(
                'flex items-center gap-2',
                'border border-gray-200 dark:border-gray-700',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'rounded-lg px-4 py-2',
                'shadow-sm'
              )}
            >
              {isReverseOrder ? (
                <BarsArrowUpIcon className='h-4 w-4' />
              ) : (
                <BarsArrowDownIcon className='h-4 w-4' />
              )}
              <span>{isReverseOrder ? 'Oldest First' : 'Latest First'}</span>
            </Button>
          </div>
        </div>
        {/* timeline content part */}
        <div className='flex h-full flex-row gap-2'>
          <div className='flex-1'>
            <div className='shrink-0'>
              <Timeline
                timeline={
                  isReverseOrder ? workflowRuntimelineData.reverse() : workflowRuntimelineData
                }
                handldEventClick={handleTimelineSelect}
                isCollapsed={showPayload}
              />
            </div>
          </div>
          {showPayload && (
            <div className='flex-2'>
              <PayloadContent
                selectedState={selectedState || ''}
                currentState={currentState || ''}
              />
            </div>
          )}
        </div>

        <div>
          {/* comment dialog */}
          <CommentDialog
            isOpenAddCommentDialog={false}
            isOpenUpdateCommentDialog={isOpenUpdateCommentDialog}
            isOpenDeleteCommentDialog={isOpenDeleteCommentDialog}
            comment={comment}
            setComment={setComment}
            handleClose={() => {
              setIsOpenUpdateCommentDialog(false);
              setIsOpenDeleteCommentDialog(false);
              setComment('');
            }}
            handleAddComment={() => {}}
            handleUpdateComment={handleUpdateComment}
            handleDeleteComment={handleDeleteComment}
            user={user}
          />
          {/* state dialog */}
          <StatesDialog
            isOpenAddStateDialog={false}
            isOpenUpdateStateDialog={isOpenUpdateStateDialog}
            user={user}
            validState={validState}
            stateStatus={stateStatus}
            setStateStatus={setStateStatus}
            selectedState={selectedState}
            currentState={currentState}
            handleClose={() => {
              setIsOpenUpdateStateDialog(false);
            }}
            stateComment={stateComment}
            setStateComment={setStateComment}
            handleStateCreationEvent={() => {}}
            handleUpdateState={handleUpdateState}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowRunTimeline;
