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
import { Dialog } from '@/components/dialogs';
import { Textarea } from '@headlessui/react';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { Badge } from '@/components/common/badges';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';
import { classNames, getUsername } from '@/utils/commonUtils';
import { BackdropWithText } from '@/components/common/backdrop';
import { useWorkflowRunContext } from './WorkflowRunContext';
import { Button } from '@/components/common/buttons';

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
  const [stateStatus, setStateStatus] = useState<string | null>(null);
  const [isOpenUpdateStateDialog, setIsOpenUpdateStateDialog] = useState<boolean>(false);
  const [stateId, setStateId] = useState<string | null>(null);
  const [stateComment, setStateComment] = useState<string>('');

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

  // format data and disply in the table
  const workflowStateTimelineData = useMemo(
    () =>
      workflowStateData
        ? workflowStateData.map((state) => ({
            id: state.orcabusId,
            content: (
              <div className='flex flex-row gap-2 text-sm text-gray-500 group'>
                <div>Status Updated</div>
                <Badge status={state.status}>{state.status}</Badge>
                {Object.keys(workflowRunStateValidMapData || {}).includes(state.status) && (
                  <div className='opacity-0 group-hover:opacity-100'>
                    <Tooltip
                      text='Update the Resolved Event Comment'
                      position='top'
                      background='white'
                    >
                      <WrenchIcon
                        className='w-4 h-4 cursor-pointer stroke-gray-500'
                        onClick={() => {
                          setStateId(state.orcabusId);
                          setStateComment(state.comment || '');
                          setIsOpenUpdateStateDialog(true);
                        }}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
            ),
            datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm'),
            comment: state.comment || '',
            status: state.status,
            iconBackground: statusBackgroundColor(getBadgeType(state.status)),
            payloadId: state?.payload || '',
            eventType: 'stateChange' as const,
          }))
        : [],
    [workflowStateData, workflowRunStateValidMapData]
  );
  const workflowCommentTimelineData = useMemo(
    () =>
      workflowCommentData
        ? workflowCommentData
            .map((comment) => ({
              id: comment.orcabusId,
              content: (
                <div className='flex flex-row gap-2 text-sm text-gray-500 group'>
                  <div className='font-medium text-nowrap'>{`${getUsername(comment.createdBy)} `}</div>
                  <div className='text-gray-500 text-nowrap'>made a new</div>
                  <Badge type='unknown'>Comment</Badge>
                  {comment.comment && (
                    <div className='opacity-0 group-hover:opacity-100 flex flex-row gap-2'>
                      <Tooltip text='Update' position='top' background='white'>
                        <WrenchIcon
                          className='w-4 h-4 cursor-pointer stroke-gray-500'
                          onClick={() => {
                            setCommentId(comment.orcabusId);
                            setComment(comment.comment);
                            setIsOpenUpdateCommentDialog(true);
                          }}
                        />
                      </Tooltip>
                      <Tooltip text='Delete' position='top' background='white'>
                        <TrashIcon
                          className='w-4 h-4 cursor-pointer stroke-gray-500'
                          onClick={() => {
                            setCommentId(comment.orcabusId);
                            setIsOpenDeleteCommentDialog(true);
                          }}
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
              ),
              status: undefined,
              datetime: dayjs(comment.updatedAt).format('YYYY-MM-DD HH:mm'),
              iconBackground: 'bg-green-100',
              comment: comment.comment,
              eventType: 'comment' as const,
            }))
            .reverse()
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

  return (
    <div>
      {(isFetchingWorkflowState || isFetchingWorkflowComment) && (
        <BackdropWithText text='Loading Status data...' />
      )}
      <div className='flex flex-row pb-4'>
        <div className='flex-1'>
          <div className='pb-4 flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <h2 className='text-lg font-semibold text-gray-900'>Timeline</h2>
              <div className='flex items-center gap-1'>
                <span className='text-sm text-gray-500'>
                  {workflowRuntimelineData.length} events
                </span>
                <span className='text-sm text-gray-400'>•</span>
                <button
                  onClick={() => setIsReverseOrder(!isReverseOrder)}
                  className='inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  <ArrowsUpDownIcon className='w-4 h-4' />
                  <span>{isReverseOrder ? 'Oldest First' : 'Latest First'}</span>
                </button>
              </div>
            </div>

            <div className='flex flex-row gap-2 items-end'>
              <Button
                type='gray'
                size='xs'
                rounded
                onClick={() => {
                  setIsOpenAddCommentDialog(true);
                }}
                className='ring-2 ring-gray-300'
              >
                <ChatBubbleLeftRightIcon className='w-4 h-4' />
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
                  <PlusIcon className='w-4 h-4' />
                  Add New State
                </Button>
              )}
            </div>
          </div>
          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenAddCommentDialog}
            title='Add a new comment'
            content={
              <div className='flex flex-col gap-4 p-2'>
                {/* User Info Section */}
                <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 text-sm font-medium'>
                      {user?.email?.[0].toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-900'>
                      {user?.email || 'Unknown User'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {dayjs().format('MMM D, YYYY • h:mm A')}
                    </span>
                  </div>
                </div>

                {/* Comment Input Section */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor='comment' className='text-sm font-medium text-gray-700'>
                    Comment
                  </label>
                  <Textarea
                    id='comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Write your comment here...'
                    className='min-h-[120px] w-full rounded-lg border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 
                     text-sm text-gray-900 p-3'
                  />
                </div>
              </div>
            }
            onClose={() => {
              setIsOpenAddCommentDialog(false);
              setComment('');
            }}
            closeBtn={{
              label: 'Close',
              onClick: () => {
                setIsOpenAddCommentDialog(false);
              },
            }}
            confirmBtn={{ label: 'Add Comment', onClick: handleAddComment }}
          ></Dialog>
          <Dialog
            TitleIcon={PlusCircleIcon}
            open={isOpenAddStateDialog}
            title='Add New State'
            content={
              <div className='flex flex-col gap-4 p-2'>
                {/* User Info Section */}
                <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 text-sm font-medium'>
                      {user?.email?.[0].toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-900'>
                      {user?.email || 'Unknown User'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {dayjs().format('MMM D, YYYY • h:mm A')}
                    </span>
                  </div>
                </div>

                {/* state status */}
                <div className='flex flex-col gap-2'>
                  <div className='text-xs font-medium pt-1 mb-1'>
                    Please select the state status:
                  </div>
                  <div className='flex gap-1 flex-wrap'>
                    {validState?.map((state, idx) => (
                      <label
                        key={idx}
                        className='flex items-center px-2 py-1 rounded-md border cursor-pointer transition-colors'
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

                {/* State Comment Input Section */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor='stateComment' className='text-sm font-medium text-gray-700'>
                    Comment
                  </label>
                  <Textarea
                    id='stateComment'
                    value={stateComment}
                    onChange={(e) => setStateComment(e.target.value)}
                    placeholder='Write your state comment here...'
                    className='min-h-[120px] w-full rounded-lg border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 
                     text-sm text-gray-900 p-3'
                  />
                </div>
              </div>
            }
            onClose={() => {
              setIsOpenAddStateDialog(false);
              setStateComment('');
              setStateStatus(null);
            }}
            closeBtn={{
              label: 'Close',
              onClick: () => {
                setIsOpenAddStateDialog(false);
              },
            }}
            confirmBtn={{ label: 'Confirm', onClick: handleStateCreationEvent }}
          ></Dialog>
          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenUpdateCommentDialog}
            title='Update Comment'
            content={
              <div className='flex flex-col gap-4 p-2'>
                {/* User Info Section */}
                <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 text-sm font-medium'>
                      {user?.email?.[0].toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-900'>
                      {user?.email || 'Unknown User'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {dayjs().format('MMM D, YYYY • h:mm A')}
                    </span>
                  </div>
                </div>

                {/* Comment Input Section */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor='comment' className='text-sm font-medium text-gray-700'>
                    Comment
                  </label>
                  <Textarea
                    id='comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Write your comment here...'
                    className='min-h-[120px] w-full rounded-lg border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 
                     text-sm text-gray-900 p-3'
                  />
                </div>
              </div>
            }
            onClose={() => {
              setIsOpenUpdateCommentDialog(false);
            }}
            confirmBtn={{ label: 'Update Comment', onClick: handleUpdateComment }}
          ></Dialog>

          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenDeleteCommentDialog}
            title='Delete Comment'
            content={
              <div className='flex flex-col gap-4 p-2'>
                {/* User Info Section */}
                <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 text-sm font-medium'>
                      {user?.email?.[0].toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-900'>
                      {user?.email || 'Unknown User'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {dayjs().format('MMM D, YYYY • h:mm A')}
                    </span>
                  </div>
                </div>

                {/* Delete Confirmation Section */}
                <div className='flex flex-col gap-2 bg-red-50 p-4 rounded-lg'>
                  <div className='text-sm font-medium text-red-800'>
                    Are you sure you want to delete this comment?
                  </div>
                  <div className='text-sm text-red-600'>This action will be irreversible.</div>
                </div>
              </div>
            }
            onClose={() => {
              setIsOpenDeleteCommentDialog(false);
            }}
            confirmBtn={{ label: 'Delete Comment', onClick: handleDeleteComment }}
          ></Dialog>

          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenUpdateStateDialog}
            title='Update State'
            content={
              <div className='flex flex-col gap-4 p-2'>
                {/* User Info Section */}
                <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 text-sm font-medium'>
                      {user?.email?.[0].toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-900'>
                      {user?.email || 'Unknown User'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {dayjs().format('MMM D, YYYY • h:mm A')}
                    </span>
                  </div>
                </div>

                {/* State Status Section */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>Current State Status</label>
                  <div className='bg-gray-50 p-3 rounded-lg'>
                    <Badge status={selectedState || currentState || 'unknown'}>
                      {selectedState || currentState || 'unknown'}
                    </Badge>
                  </div>
                </div>

                {/* State Comment Input Section */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor='stateComment' className='text-sm font-medium text-gray-700'>
                    Comment
                  </label>
                  <Textarea
                    id='stateComment'
                    value={stateComment}
                    onChange={(e) => setStateComment(e.target.value)}
                    placeholder='Write your state comment here...'
                    className='min-h-[120px] w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900 p-3'
                  />
                </div>
              </div>
            }
            onClose={() => {
              setIsOpenUpdateStateDialog(false);
              setStateComment('');
            }}
            confirmBtn={{ label: 'Update State', onClick: handleUpdateState }}
          ></Dialog>

          <Timeline
            timeline={isReverseOrder ? workflowRuntimelineData.reverse() : workflowRuntimelineData}
            handldEventClick={handleTimelineSelect}
          />
        </div>
        <div className='flex-2'>
          <div className='text-base font-semibold pb-4'>Payload</div>
          <div className='flex flex-row gap-2 items-center'>
            <div className='text-sm text-gray-500'>Selected State:</div>
            <Badge status={selectedState || currentState || 'unknown'}>
              {selectedState || currentState || 'unknown'}
            </Badge>
          </div>
          <ContentTabs
            tabs={[
              {
                label: 'List',
                content: (
                  <JsonToNestedList
                    cellValueFormat={cellValueFormat}
                    data={selectedWorkflowPayloadData?.data as Record<string, unknown>}
                    isFetchingData={isFetching}
                  />
                ),
              },
              {
                label: 'JSON',
                content: (
                  <JsonDisplay
                    data={selectedWorkflowPayloadData as Record<string, unknown>}
                    isFetchingData={isFetching}
                  />
                ),
              },
            ]}
          />
        </div>
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
        className={classNames('text-sm font-medium hover:text-blue-700 text-blue-500')}
      >
        {value}
      </Link>
    );
  },
};
