import {
  useSequenceRunStateListModel,
  useSequenceRunCommentListModel,
  useSequenceRunCommentCreateModel,
  useSequenceRunCommentUpdateModel,
  useSequenceRunCommentDeleteModel,
} from '@/api/sequenceRun';
import { useState, useEffect, useMemo } from 'react';
import { dayjs } from '@/utils/dayjs';
import Badge from '@/components/common/badges/Badge';
import { Tooltip } from '@/components/common/tooltips';
import { WrenchIcon, TrashIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { getUsername } from '@/utils/commonUtils';
import { Timeline } from '@/components/common/timelines';
import { getBadgeStatusType, statusBackgroundColor } from '@/utils/statusUtils';
import { BackdropWithText } from '@/components/common/backdrop';
import { Button } from '@/components/common/buttons';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Dialog } from '@/components/common/dialogs';
import { Textarea } from '@headlessui/react';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import toaster from '@/components/common/toaster';

const SequenceRunTimeline = ({ selectedSequenceRunId }: { selectedSequenceRunId: string }) => {
  const { user } = useAuthContext();

  const [selectedSequenceRunID, setSelectedSequenceRunId] = useState<string>(selectedSequenceRunId);
  const [isOpenAddCommentDialog, setIsOpenAddCommentDialog] = useState<boolean>(false);
  const [isOpenUpdateCommentDialog, setIsOpenUpdateCommentDialog] = useState<boolean>(false);
  const [isOpenDeleteCommentDialog, setIsOpenDeleteCommentDialog] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    setSelectedSequenceRunId(selectedSequenceRunId);
  }, [selectedSequenceRunId]);

  const { data: sequenceRunStateDetail, isFetching: isFetchingSequenceRunStateDetail } =
    useSequenceRunStateListModel({
      params: { path: { orcabusId: selectedSequenceRunID } },
      reactQuery: {
        enabled: !!selectedSequenceRunID,
      },
    });

  const {
    data: sequenceRunCommentsDetail,
    isFetching: isFetchingSequenceRunComments,
    refetch: refetchSequenceRunComment,
  } = useSequenceRunCommentListModel({
    params: { path: { orcabusId: selectedSequenceRunID } },
    reactQuery: {
      enabled: !!selectedSequenceRunID,
    },
  });

  const SequenceRunStateTimelineData = useMemo(() => {
    return sequenceRunStateDetail?.map((state) => ({
      id: state.orcabusId || '',
      content: (
        <div className='group flex flex-row gap-2 text-sm text-gray-500'>
          <div>Status Updated</div>
          <Badge status={state.status}>{state.status}</Badge>
        </div>
      ),
      datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm'),
      comment: state.comment || '',
      status: state.status,
      iconBackground: statusBackgroundColor(getBadgeStatusType(state.status)),
      payloadId: '',
      eventType: 'stateChange' as const,
    }));
  }, [sequenceRunStateDetail]);

  const SequenceRunCommentTimelineData = useMemo(() => {
    return sequenceRunCommentsDetail?.map((comment) => ({
      id: comment.orcabusId || '',
      content: (
        <div className='group flex flex-row gap-2 text-sm text-gray-500'>
          <div className='text-nowrap font-medium'>{`${getUsername(comment.createdBy)} `}</div>
          <div className='text-nowrap text-gray-500'>made a new</div>
          <Badge type='unknown'>Comment</Badge>
          {comment.comment && (
            <div className='flex flex-row gap-2 opacity-0 group-hover:opacity-100'>
              <Tooltip text='Update' position='top' background='light'>
                <WrenchIcon
                  className='h-4 w-4 cursor-pointer stroke-gray-500'
                  onClick={() => {
                    setCommentId(comment.orcabusId as string);
                    setComment(comment.comment);
                    setIsOpenUpdateCommentDialog(true);
                  }}
                />
              </Tooltip>
              <Tooltip text='Delete' position='top' background='light'>
                <TrashIcon
                  className='h-4 w-4 cursor-pointer stroke-gray-500'
                  onClick={() => {
                    setCommentId(comment.orcabusId as string);
                    setIsOpenDeleteCommentDialog(true);
                  }}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ),
      datetime: dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm'),
      type: 'comment',
      comment: comment.comment || '',
      eventType: 'comment' as const,
      iconBackground: 'bg-green-100',
    }));
  }, [sequenceRunCommentsDetail]);

  const timelineData = useMemo(() => {
    return [
      ...(SequenceRunStateTimelineData || []),
      ...(SequenceRunCommentTimelineData || []),
    ].sort((a, b) => (dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? -1 : 1));
  }, [SequenceRunStateTimelineData, SequenceRunCommentTimelineData]);

  const {
    mutate: createSequenceRunComment,
    isSuccess: isCreatedSequenceRunComment,
    isError: isErrorCreatingSequenceRunComment,
    reset: resetCreateSequenceRunComment,
  } = useSequenceRunCommentCreateModel({
    params: { path: { orcabusId: selectedSequenceRunID } },
    body: {
      comment: comment,
      createdBy: user?.email,
    },
  });

  const handleAddComment = () => {
    createSequenceRunComment();
    setIsOpenAddCommentDialog(false);
  };

  useEffect(() => {
    if (isCreatedSequenceRunComment) {
      toaster.success({ title: 'Comment added successfully' });
      refetchSequenceRunComment();
      resetCreateSequenceRunComment();
      setComment('');
    }

    if (isErrorCreatingSequenceRunComment) {
      toaster.error({ title: 'Error adding comment' });
      resetCreateSequenceRunComment();
    }
  }, [
    isCreatedSequenceRunComment,
    isErrorCreatingSequenceRunComment,
    refetchSequenceRunComment,
    resetCreateSequenceRunComment,
  ]);

  const {
    mutate: updateSequenceRunComment,
    isSuccess: isUpdatedSequenceRunComment,
    isError: isErrorUpdatingSequenceRunComment,
    reset: resetUpdateSequenceRunComment,
  } = useSequenceRunCommentUpdateModel({
    params: { path: { orcabusId: selectedSequenceRunID as string, id: commentId as string } },
    body: {
      comment: comment,
      createdBy: user?.email,
    },
    reactQuery: {
      enabled: !!commentId,
    },
  });

  const handleUpdateComment = () => {
    updateSequenceRunComment();
    setIsOpenUpdateCommentDialog(false);
  };

  useEffect(() => {
    if (isUpdatedSequenceRunComment) {
      toaster.success({ title: 'Comment updated successfully' });
      refetchSequenceRunComment();
      resetUpdateSequenceRunComment();
      setComment('');
    }

    if (isErrorUpdatingSequenceRunComment) {
      toaster.error({ title: 'Error updating comment' });
      resetUpdateSequenceRunComment();
    }
  }, [
    isUpdatedSequenceRunComment,
    refetchSequenceRunComment,
    resetUpdateSequenceRunComment,
    isErrorUpdatingSequenceRunComment,
  ]);

  const {
    mutate: deleteSequenceRunComment,
    isSuccess: isDeletedSequenceRunComment,
    isError: isErrorDeletingSequenceRunComment,
    reset: resetDeleteSequenceRunComment,
  } = useSequenceRunCommentDeleteModel({
    params: { path: { orcabusId: selectedSequenceRunID as string, id: commentId as string } },
    body: {
      createdBy: user?.email,
    },
  });

  const handleDeleteComment = () => {
    deleteSequenceRunComment();
    setIsOpenDeleteCommentDialog(false);
  };

  useEffect(() => {
    if (isDeletedSequenceRunComment) {
      toaster.success({ title: 'Comment deleted successfully' });
      refetchSequenceRunComment();
      resetDeleteSequenceRunComment();
      setComment('');
    }

    if (isErrorDeletingSequenceRunComment) {
      toaster.error({ title: 'Error deleting comment' });
      resetDeleteSequenceRunComment();
    }
  }, [
    isDeletedSequenceRunComment,
    refetchSequenceRunComment,
    resetDeleteSequenceRunComment,
    isErrorDeletingSequenceRunComment,
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

  return (
    <div>
      {(isFetchingSequenceRunStateDetail || isFetchingSequenceRunComments) && (
        <BackdropWithText text='Loading Timeline data...' />
      )}
      <div className='flex flex-row py-4'>
        <Button
          type='gray'
          size='xs'
          rounded
          onClick={() => {
            setIsOpenAddCommentDialog(true);
          }}
          className='ring-2 ring-gray-300'
        >
          <PlusIcon className='h-4 w-4' />
          Add Comment
        </Button>
      </div>
      <Timeline timeline={timelineData || [{ id: 'loading' }]} />
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
    </div>
  );
};

export default SequenceRunTimeline;
