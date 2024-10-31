import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  useWorkflowRunResolvedStateCreateModel,
  useWorkflowRunResolvedStateUpdateModel,
} from '@/api/workflow';
import { keepPreviousData } from '@tanstack/react-query';
import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleBottomCenterTextIcon,
  WrenchIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toaster from '@/components/common/toaster';
import { Tooltip } from '@/components/common/tooltips';
import { Dialog } from '@/components/dialogs';
import { Textarea } from '@headlessui/react';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { Badge } from '@/components/common/badges';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';
import { getUsername } from '@/utils/commonUtils';
import { BackdropWithText } from '@/components/common/backdrop';

const WorkflowRunTimeline = () => {
  const { orcabusId } = useParams();
  const { user } = useAuthContext();

  const [selectedPayloadId, setSelectedPayloadId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const [isOpenAddCommentDialog, setIsOpenAddCommentDialog] = useState<boolean>(false);
  const [isOpenUpdateCommentDialog, setIsOpenUpdateCommentDialog] = useState<boolean>(false);
  const [isOpenDeleteCommentDialog, setIsOpenDeleteCommentDialog] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isOpenAddResolvedDialog, setIsOpenAddResolvedDialog] = useState<boolean>(false);
  const [isOpenUpdateResolvedDialog, setIsOpenUpdateResolvedDialog] = useState<boolean>(false);
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [resolvedComment, setResolvedComment] = useState<string>('');

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

  const currentState = workflowStateData?.[workflowStateData.length - 1]?.status;

  // format data and disply in the table
  const workflowStateTimelineData = useMemo(
    () =>
      workflowStateData
        ? workflowStateData
            .map((state) => ({
              id: state.orcabusId,
              content: (
                <div className='flex flex-row gap-2 text-sm text-gray-500 group'>
                  <div>Status Updated</div>
                  <Badge status={state.status}>{state.status}</Badge>
                  {state.status === 'RESOLVED' && (
                    <div className='opacity-0 group-hover:opacity-100'>
                      <Tooltip
                        text='Update the Resolved Event Comment'
                        position='top'
                        background='white'
                      >
                        <WrenchIcon
                          className='w-4 h-4 cursor-pointer stroke-gray-500'
                          onClick={() => {
                            setResolvedId(state.orcabusId);
                            setResolvedComment(state.comment || '');
                            setIsOpenUpdateResolvedDialog(true);
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
            .reverse()
        : [],
    [workflowStateData]
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
    mutate: createWorkflowRunResolvedState,
    isSuccess: isCreatedWorkflowRunResolvedState,
    isError: isErrorCreatingWorkflowRunResolvedState,
    reset: resetCreateWorkflowRunResolvedState,
  } = useWorkflowRunResolvedStateCreateModel({
    params: { path: { orcabusId: orcabusId?.split('.')[1] as string } },
    body: {
      status: 'RESOLVED',
      comment: resolvedComment,
      createdBy: user?.email,
    },
  });

  const handleResolvedEvent = () => {
    createWorkflowRunResolvedState();
    setIsOpenAddResolvedDialog(false);
  };

  useEffect(() => {
    if (isCreatedWorkflowRunResolvedState) {
      toaster.success({ title: 'Resolved Status added' });
      refetchWorkflowState();
      resetCreateWorkflowRunResolvedState();
      setResolvedComment('');
    }

    if (isErrorCreatingWorkflowRunResolvedState) {
      toaster.error({ title: 'Error adding resolved status' });
      resetCreateWorkflowRunResolvedState();
    }
  }, [
    isCreatedWorkflowRunResolvedState,
    refetchWorkflowState,
    resetCreateWorkflowRunResolvedState,
    isErrorCreatingWorkflowRunResolvedState,
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
    mutate: updateWorkflowRunResolvedState,
    isSuccess: isUpdatedWorkflowRunResolvedState,
    isError: isErrorUpdatingWorkflowRunResolvedState,
    reset: resetUpdateWorkflowRunResolvedState,
  } = useWorkflowRunResolvedStateUpdateModel({
    params: {
      path: {
        orcabusId: orcabusId?.split('.')[1] as string,
        id: resolvedId?.split('.')[1] as string,
      },
    },
    body: {
      comment: resolvedComment,
    },
  });

  const handleUpdateResolved = () => {
    updateWorkflowRunResolvedState();
    setIsOpenUpdateResolvedDialog(false);
  };

  useEffect(() => {
    if (isUpdatedWorkflowRunResolvedState) {
      toaster.success({ title: 'Resolved Event updated successfully' });
      refetchWorkflowState();
      resetUpdateWorkflowRunResolvedState();
      setResolvedComment('');
    }

    if (isErrorUpdatingWorkflowRunResolvedState) {
      toaster.error({ title: 'Error updating resolved event' });
      resetUpdateWorkflowRunResolvedState();
    }
  }, [
    isUpdatedWorkflowRunResolvedState,
    refetchWorkflowState,
    resetUpdateWorkflowRunResolvedState,
    isErrorUpdatingWorkflowRunResolvedState,
  ]);

  return (
    <div>
      {(isFetchingWorkflowState || isFetchingWorkflowComment) && (
        <BackdropWithText text='Loading Status data...' />
      )}
      <div className='flex flex-row pb-4'>
        <div className='flex-1'>
          <div className='pb-4 flex flex-row gap-2 items-end'>
            <div className='text-base font-semibold '>Timeline</div>
            <Tooltip text='Add a new comment' position='top' background='white'>
              <ChatBubbleLeftRightIcon
                className='w-5 h-5 cursor-pointer stroke-gray-500 opacity-opacity-100'
                onClick={() => {
                  setIsOpenAddCommentDialog(true);
                }}
              />
            </Tooltip>
            {currentState === 'FAILED' && (
              <Tooltip text='Add the Resolved Event' position='top' background='white'>
                <CheckCircleIcon
                  className='w-5 h-5 cursor-pointer stroke-gray-500 opacity-opacity-100'
                  onClick={() => {
                    setIsOpenAddResolvedDialog(true);
                  }}
                />
              </Tooltip>
            )}
          </div>
          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenAddCommentDialog}
            title='Add a new comment'
            content={
              <div className='flex flex-col gap-2'>
                <div className='text-sm font-semibold'>Comment</div>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
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
            TitleIcon={CheckCircleIcon}
            open={isOpenAddResolvedDialog}
            title='Add the Resolved Event'
            content={
              <div className='flex flex-col gap-2'>
                <div className='text-sm font-semibold'>Comment</div>
                <Textarea
                  value={resolvedComment}
                  onChange={(e) => setResolvedComment(e.target.value)}
                />
              </div>
            }
            onClose={() => {
              setIsOpenAddResolvedDialog(false);
              setResolvedComment('');
            }}
            closeBtn={{
              label: 'Close',
              onClick: () => {
                setIsOpenAddResolvedDialog(false);
              },
            }}
            confirmBtn={{ label: 'Confirm', onClick: handleResolvedEvent }}
          ></Dialog>
          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenUpdateCommentDialog}
            title='Update Comment'
            content={
              <div className='flex flex-col gap-2'>
                <div className='text-sm font-semibold'>Comment</div>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
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
            onClose={() => {
              setIsOpenDeleteCommentDialog(false);
            }}
            confirmBtn={{ label: 'Delete Comment', onClick: handleDeleteComment }}
          ></Dialog>

          <Dialog
            TitleIcon={ChatBubbleBottomCenterTextIcon}
            open={isOpenUpdateResolvedDialog}
            title='Update Resolved Event'
            content={
              <div className='flex flex-col gap-2'>
                <div className='text-sm font-semibold'>Comment</div>
                <Textarea
                  value={resolvedComment}
                  onChange={(e) => setResolvedComment(e.target.value)}
                />
              </div>
            }
            onClose={() => {
              setIsOpenUpdateResolvedDialog(false);
            }}
            confirmBtn={{ label: 'Update Resolved Event', onClick: handleUpdateResolved }}
          ></Dialog>
          <div className='px-4'>
            <Timeline timeline={workflowRuntimelineData} handldEventClick={handleTimelineSelect} />
          </div>
        </div>
        <div className='flex-2'>
          <div className='text-base font-semibold pb-4'>Payload</div>
          <div className='flex flex-row gap-2 items-center'>
            <div className='text-sm text-gray-500'>Selected State:</div>
            <Badge status={selectedState || 'unknown'}>{selectedState || 'unknown'}</Badge>
          </div>
          <ContentTabs
            tabs={[
              {
                label: 'List',
                content: (
                  <JsonToNestedList
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
