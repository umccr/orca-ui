import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Timeline } from '@/components/common/timelines';
import type { TimelineEvent } from '@/components/common/timelines';
import { ContentTabs } from '@/components/navigation/tabs';
import { JsonToNestedList, JsonDisplay } from '@/components/common/json-to-table';
import {
  useWorkflowStateModel,
  useWorkflowRunCommentModel,
  useWorkflowPayloadModel,
  useWorkflowRunCommentCreateModel,
  useWorkflowRunCommentUpdateModel,
  useWorkflowRunCommentDeleteModel,
  useWorkflowRunStateCreateModel,
  useWorkflowRunStateUpdateModel,
  useWorkflowRunStateValidMapModel,
} from '@/api/workflow';
import { keepPreviousData } from '@tanstack/react-query';
import {
  PlusCircleIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleBottomCenterTextIcon,
  WrenchIcon,
  TrashIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import toaster from '@/components/common/toaster';
import { Tooltip } from '@/components/common/tooltips';
import { Dialog } from '@/components/common/dialogs';
import { Textarea } from '@headlessui/react';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { Badge } from '@/components/common/badges';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';
import { classNames, getUsername } from '@/utils/commonUtils';
import { BackdropWithText } from '@/components/common/backdrop';
import { useWorkflowRunContext } from './WorkflowRunContext';
import { Button } from '@/components/common/buttons';
import { SideDrawer } from '@/components/common/drawers';

const WorkflowRunTimeline = () => {
  const { orcabusId } = useParams();
  const { user } = useAuthContext();
  const { refreshWorkflowRuns, setRefreshWorkflowRuns } = useWorkflowRunContext();
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [selectedPayloadId, setSelectedPayloadId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const [isOpenAddCommentDialog, setIsOpenAddCommentDialog] = useState<boolean>(false);
  const [isOpenUpdateCommentDialog, setIsOpenUpdateCommentDialog] = useState<boolean>(false);
  const [isOpenDeleteCommentDialog, setIsOpenDeleteCommentDialog] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  const [isReverseOrder, setIsReverseOrder] = useState<boolean>(false);

  const [isOpenAddStateDialog, setIsOpenAddStateDialog] = useState<boolean>(false);
  const [isOpenUpdateStateDialog, setIsOpenUpdateStateDialog] = useState<boolean>(false);
  const [stateStatus, setStateStatus] = useState<string | null>(null);
  const [stateId, setStateId] = useState<string | null>(null);
  const [stateComment, setStateComment] = useState<string>('');

  const [isOpenSideDrawer, setIsOpenSideDrawer] = useState<boolean>(false);

  const {
    data: workflowStateData,
    isFetching: isFetchingWorkflowState,
    refetch: refetchWorkflowState,
  } = useWorkflowStateModel({
    params: { path: { orcabusId: orcabusId?.split('.')[1] as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  useEffect(() => {
    if (refreshWorkflowRuns) {
      refetchWorkflowState();
      setRefreshWorkflowRuns(false);
    }
  }, [refreshWorkflowRuns, refetchWorkflowState, setRefreshWorkflowRuns]);

  const {
    data: workflowCommentData,
    isFetching: isFetchingWorkflowComment,
    refetch: refetchWorkflowComment,
  } = useWorkflowRunCommentModel({
    params: { path: { orcabusId: orcabusId?.split('.')[1] as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const { data: workflowRunStateValidMapData } = useWorkflowRunStateValidMapModel({
    params: { path: { orcabusId: orcabusId?.split('.')[1] as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const workflowLastState = workflowStateData?.[workflowStateData.length - 1]?.status;

  // check if the last state is valid for state creation
  const isValidCreateState = Object.entries(workflowRunStateValidMapData || {}).some(([, value]) =>
    (value as string[]).includes(workflowLastState || '')
  );
  // find all valid state key who has vale of workflowLastState
  const validState = Object.entries(workflowRunStateValidMapData || {})
    .filter(([, value]) => (value as string[]).includes(workflowLastState || ''))
    .map(([key]) => key);

  const workflowStateTimelineData = useMemo(
    () =>
      workflowStateData
        ? workflowStateData.map((state) => ({
            id: state.orcabusId,
            title: 'Workflow State Update',
            content: (
              <div className='flex items-center gap-3'>
                <div className='flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <Badge status={state.status}>{state.status}</Badge>
                    {Object.keys(workflowRunStateValidMapData || {}).includes(state.status) && (
                      <Tooltip
                        text='Update State Comment'
                        position='top'
                        background='dark'
                        size='small'
                      >
                        <button
                          onClick={() => {
                            setStateId(state.orcabusId);
                            setStateComment(state.comment || '');
                            setIsOpenUpdateStateDialog(true);
                          }}
                          className='rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                          <WrenchIcon className='h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300' />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ),
            datetime: state.timestamp,
            comment: state.comment || '',
            status: state.status,
            iconBackground: statusBackgroundColor(getBadgeType(state.status)),
            payloadId: state?.payload || '',
            eventType: 'stateChange' as const,
            // user: {
            //   name: getUsername(state.createdBy || ''),
            //   // Optional: Add avatar if available
            //   // avatar: getUserAvatar(state.createdBy)
            // },
            // tags: [state.status]
          }))
        : [],
    [workflowStateData, workflowRunStateValidMapData]
  );

  const workflowCommentTimelineData = useMemo(
    () =>
      workflowCommentData
        ? workflowCommentData.map((comment) => ({
            id: comment.orcabusId,
            title: 'Comment Added',
            content: (
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Badge type='unknown'>Comment</Badge>
                </div>
                {comment.comment && (
                  <div className='flex items-center gap-2'>
                    <Tooltip text='Edit Comment' position='top' background='dark' size='small'>
                      <button
                        onClick={() => {
                          setCommentId(comment.orcabusId);
                          setComment(comment.comment);
                          setIsOpenUpdateCommentDialog(true);
                        }}
                        className='rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        <WrenchIcon className='h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300' />
                      </button>
                    </Tooltip>
                    <Tooltip text='Delete Comment' position='top' background='dark' size='small'>
                      <button
                        onClick={() => {
                          setCommentId(comment.orcabusId);
                          setIsOpenDeleteCommentDialog(true);
                        }}
                        className='rounded-full p-1 text-red-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            ),
            datetime: comment.updatedAt,
            iconBackground: 'bg-blue-100 dark:bg-blue-900',
            comment: comment.comment,
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
    params: { path: { id: selectedPayloadId?.split('.')[1] || '' } },
    reactQuery: {
      enabled: !!selectedPayloadId,
      placeholderData: keepPreviousData,
    },
  });

  const {
    mutate: createWorkflowRunComment,
    isSuccess: isCreatedWorkflowRunComment,
    isError: isErrorCreatingWorkflowRunComment,
    reset: resetCreateWorkflowRunComment,
  } = useWorkflowRunCommentCreateModel({
    params: { path: { orcabusId: orcabusId?.split('.')[1] as string } },
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
    params: { path: { orcabusId: orcabusId?.split('.')[1] as string } },
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

  const handleTimelineSelect = (event: TimelineEvent) => {
    if (event.eventType === 'stateChange') {
      setSelectedPayloadId(event.payloadId || null);
      setSelectedState(event.status || null);
      setIsOpenSideDrawer(true);
    }
  };

  const {
    mutate: updateWorkflowRunComment,
    isSuccess: isUpdatedWorkflowRunComment,
    isError: isErrorUpdatingWorkflowRunComment,
    reset: resetUpdateWorkflowRunComment,
  } = useWorkflowRunCommentUpdateModel({
    params: {
      path: {
        orcabusId: orcabusId?.split('.')[1] as string,
        id: commentId?.split('.')[1] as string,
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
        orcabusId: orcabusId?.split('.')[1] as string,
        id: commentId?.split('.')[1] as string,
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
        orcabusId: orcabusId?.split('.')[1] as string,
        id: stateId?.split('.')[1] as string,
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

  const userProfileSection = useMemo(() => {
    return (
      <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
          <span className='text-sm font-medium text-blue-600 dark:text-blue-300'>
            {user?.email?.[0].toUpperCase() || '?'}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
            {user?.email || 'Unknown User'}
          </span>
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            {dayjs().format('MMM D, YYYY • h:mm A')}
          </span>
        </div>
      </div>
    );
  }, [user]);

  // Create a PayloadContent component for the drawer
  const PayloadContent = ({
    selectedState,
    currentState,
  }: {
    selectedState: string;
    currentState: string;
  }) => (
    <div className='flex flex-col space-y-4'>
      {/* State Badge */}
      <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
        <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
          Selected State:
        </span>
        <Badge status={selectedState || currentState || 'unknown'}>
          {selectedState || currentState || 'unknown'}
        </Badge>
      </div>

      {/* Content Tabs */}
      <div className='rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900'>
        <ContentTabs
          tabs={[
            {
              label: 'List View',
              content: (
                <div className='p-4'>
                  <JsonToNestedList
                    cellValueFormat={cellValueFormat}
                    data={selectedWorkflowPayloadData?.data as Record<string, unknown>}
                    isFetchingData={isFetching}
                  />
                </div>
              ),
            },
            {
              label: 'JSON View',
              content: (
                <div className='p-4'>
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
        <BackdropWithText text='Loading Status data...' />
      )}
      <div className='flex flex-row pb-4'>
        <div className='flex-1'>
          <div className='flex flex-col gap-2 pb-4'>
            <div className='flex items-center gap-3'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Timeline</h2>
              <div className='flex items-center gap-1'>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {workflowRuntimelineData.length} events
                </span>
                <span className='text-sm text-gray-400 dark:text-gray-500'>•</span>
                <button
                  onClick={() => setIsReverseOrder(!isReverseOrder)}
                  className='inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                >
                  <ArrowsUpDownIcon className='h-4 w-4' />
                  <span>{isReverseOrder ? 'Oldest First' : 'Latest First'}</span>
                </button>
              </div>
            </div>

            <div className='flex flex-row items-end gap-2'>
              <Button
                type='gray'
                size='xs'
                rounded
                onClick={() => {
                  setIsOpenAddCommentDialog(true);
                }}
                className='ring-2 ring-gray-300'
              >
                <ChatBubbleLeftRightIcon className='h-4 w-4' />
                Add Comment
              </Button>

              {isValidCreateState && (
                <Button
                  type='gray'
                  size='xs'
                  rounded
                  onClick={() => {
                    setIsOpenAddStateDialog(true);
                  }}
                  className='ring-2 ring-gray-300'
                >
                  <PlusIcon className='h-4 w-4' />
                  Add New State
                </Button>
              )}
            </div>
          </div>
          {/* comment dialog */}
          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenAddCommentDialog || isOpenUpdateCommentDialog || isOpenDeleteCommentDialog}
            title={
              isOpenAddCommentDialog
                ? 'Add a new comment'
                : isOpenUpdateCommentDialog
                  ? 'Update a comment'
                  : 'Delete a comment'
            }
            content={
              <div className='flex flex-col gap-4 p-2'>
                {/* User Info Section */}
                {userProfileSection}

                {/* Comment Input Section */}
                {(isOpenAddCommentDialog || isOpenUpdateCommentDialog) && (
                  <div className='flex flex-col gap-2'>
                    <label
                      htmlFor='comment'
                      className='text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Comment
                    </label>
                    <Textarea
                      id='comment'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder='Write your comment here...'
                      className='min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100'
                    />
                  </div>
                )}

                {isOpenDeleteCommentDialog && (
                  <div className='flex flex-col gap-2 rounded-lg bg-red-50 p-4 dark:bg-red-600/10'>
                    <div className='text-sm font-medium text-red-800 dark:text-red-100'>
                      Are you sure you want to delete this comment?
                    </div>
                    <div className='text-sm text-red-600 dark:text-red-400'>
                      This action will be irreversible.
                    </div>
                  </div>
                )}
              </div>
            }
            onClose={() => {
              setIsOpenAddCommentDialog(false);
              setIsOpenUpdateCommentDialog(false);
              setIsOpenDeleteCommentDialog(false);
              setComment('');
            }}
            closeBtn={{
              label: 'Close',
              onClick: () => {
                setIsOpenAddCommentDialog(false);
                setIsOpenUpdateCommentDialog(false);
                setIsOpenDeleteCommentDialog(false);
                setComment('');
              },
            }}
            confirmBtn={{
              label: isOpenAddCommentDialog
                ? 'Add Comment'
                : isOpenUpdateCommentDialog
                  ? 'Update Comment'
                  : 'Delete Comment',
              onClick: isOpenAddCommentDialog
                ? handleAddComment
                : isOpenUpdateCommentDialog
                  ? handleUpdateComment
                  : handleDeleteComment,
            }}
          ></Dialog>
          <Dialog
            TitleIcon={PlusCircleIcon}
            open={isOpenAddStateDialog || isOpenUpdateStateDialog}
            title={isOpenAddStateDialog ? 'Add New State' : 'Update State'}
            content={
              <div className='flex flex-col gap-4 p-2'>
                {/* User Info Section */}
                {userProfileSection}

                {/* state status */}
                {isOpenAddStateDialog && (
                  <div className='flex flex-col gap-2'>
                    <div className='mb-1 pt-1 text-xs font-medium'>
                      Please select the state status:
                    </div>
                    <div className='flex flex-wrap gap-1'>
                      {validState?.map((state, idx) => (
                        <label
                          key={idx}
                          className='flex cursor-pointer items-center rounded-md border px-2 py-1 transition-colors'
                        >
                          <input
                            type='radio'
                            name='state'
                            value={state}
                            onChange={() => setStateStatus(state)}
                          />
                          <span className='ml-1 text-xs font-medium'>{state}</span>
                        </label>
                      ))}
                    </div>
                    {!stateStatus && (
                      <div className='text-xs text-red-500'>Please select a state</div>
                    )}
                  </div>
                )}

                {isOpenUpdateStateDialog && (
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Current State Status
                    </label>
                    <div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
                      <Badge status={selectedState || currentState || 'unknown'}>
                        {selectedState || currentState || 'unknown'}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* State Comment Input Section */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='stateComment'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Comment
                  </label>
                  <Textarea
                    id='stateComment'
                    value={stateComment}
                    onChange={(e) => setStateComment(e.target.value)}
                    placeholder='Write your state comment here...'
                    className='min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100'
                  />
                </div>
              </div>
            }
            onClose={() => {
              setIsOpenAddStateDialog(false);
              setIsOpenUpdateStateDialog(false);
              setStateComment('');
              setStateStatus(null);
            }}
            closeBtn={{
              label: 'Close',
              onClick: () => {
                setIsOpenAddStateDialog(false);
                setIsOpenUpdateStateDialog(false);
                setStateComment('');
                setStateStatus(null);
              },
            }}
            confirmBtn={{
              label: isOpenAddStateDialog ? 'Add State' : 'Update State',
              onClick: isOpenAddStateDialog ? handleStateCreationEvent : handleUpdateState,
            }}
          ></Dialog>

          <Timeline
            timeline={isReverseOrder ? workflowRuntimelineData.reverse() : workflowRuntimelineData}
            handldEventClick={handleTimelineSelect}
          />
        </div>

        <SideDrawer
          isOpen={isOpenSideDrawer}
          onClose={() => setIsOpenSideDrawer(false)}
          title='Payload Details'
          subtitle={selectedPayloadId || ''}
          size='large'
        >
          <PayloadContent selectedState={selectedState || ''} currentState={currentState || ''} />
        </SideDrawer>
      </div>
    </div>
  );
};

export default WorkflowRunTimeline;

/**
 * This is an EXPERIMENTAL approach where want to be able to redirect to the `/files` page
 * with filter to a specific key prefix if an s3 uri path is found as the value
 */
const cellValueFormat = {
  condition: (value: unknown) => typeof value === 'string' && value.startsWith('s3://'),
  cell: (value: string) => {
    const s3Bucket = value.split('s3://')[1].split('/')[0];
    const s3Key = value.split(`s3://${s3Bucket}/`)[1];

    return (
      <Link
        // asterisk (*) is added to the end of the key to filter the path prefix
        to={`/files?bucket=${encodeURIComponent(s3Bucket)}&key=${encodeURIComponent(s3Key)}*`}
        className={classNames('text-sm font-medium capitalize text-blue-500 hover:text-blue-700')}
      >
        {value}
      </Link>
    );
  },
};
