import {
  useSequenceRunStateListModel,
  useSequenceRunCommentListModel,
  useSequenceRunCommentCreateModel,
  useSequenceRunCommentUpdateModel,
  useSequenceRunCommentDeleteModel,
} from '@/api/sequenceRun';
import { useState, useEffect, useMemo } from 'react';
import { dayjs } from '@/utils/dayjs';
import Badge, { getBadgeType } from '@/components/common/badges/Badge';
import { Tooltip } from '@/components/common/tooltips';
import { WrenchIcon, TrashIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { getUsername } from '@/utils/commonUtils';
import { Timeline } from '@/components/common/timelines';
import { statusBackgroundColor } from '@/components/common/badges/StatusBadge';
import { BackdropWithText } from '@/components/common/backdrop';
import { Button } from '@/components/common/buttons';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Dialog } from '@/components/dialogs';
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
      params: { path: { orcabusId: selectedSequenceRunID?.split('.')[1] as string } },
      reactQuery: {
        enabled: !!selectedSequenceRunID,
      },
    });

  const {
    data: sequenceRunCommentsDetail,
    isFetching: isFetchingSequenceRunComments,
    refetch: refetchSequenceRunComment,
  } = useSequenceRunCommentListModel({
    params: { path: { orcabusId: selectedSequenceRunID?.split('.')[1] as string } },
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
      iconBackground: statusBackgroundColor(getBadgeType(state.status)),
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
              <Tooltip text='Update' position='top' background='white'>
                <WrenchIcon
                  className='h-4 w-4 cursor-pointer stroke-gray-500'
                  onClick={() => {
                    setCommentId(comment.orcabusId);
                    setComment(comment.comment);
                    setIsOpenUpdateCommentDialog(true);
                  }}
                />
              </Tooltip>
              <Tooltip text='Delete' position='top' background='white'>
                <TrashIcon
                  className='h-4 w-4 cursor-pointer stroke-gray-500'
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
    params: { path: { orcabusId: selectedSequenceRunID?.split('.')[1] as string } },
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
    params: {
      path: {
        orcabusId: selectedSequenceRunID?.split('.')[1] as string,
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
    params: {
      path: {
        orcabusId: selectedSequenceRunID?.split('.')[1] as string,
        id: commentId?.split('.')[1] as string,
      },
    },
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

  return (
    <div>
      {(isFetchingSequenceRunStateDetail || isFetchingSequenceRunComments) && (
        <BackdropWithText text='Loading Status data...' />
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
      <Dialog
        TitleIcon={ChatBubbleBottomCenterTextIcon}
        open={isOpenAddCommentDialog}
        title='Add Comment'
        content={
          <div className='flex flex-col gap-2'>
            <div className='text-sm font-semibold'>Comment</div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='rounded-md border-[1px] border-gray-400 px-3 py-1.5 text-sm/6'
            />
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
      />
      <Dialog
        TitleIcon={ChatBubbleBottomCenterTextIcon}
        open={isOpenUpdateCommentDialog}
        title='Update Comment'
        content={
          <div className='flex flex-col gap-2'>
            <div className='text-sm font-semibold'>Comment</div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='rounded-md border-[1px] border-gray-400 px-3 py-1.5 text-sm/6'
            />
          </div>
        }
        onClose={() => {
          setIsOpenUpdateCommentDialog(false);
        }}
        closeBtn={{
          label: 'Close',
          onClick: () => {
            setIsOpenUpdateCommentDialog(false);
          },
        }}
        confirmBtn={{ label: 'Update Comment', onClick: handleUpdateComment }}
      />
      <Dialog
        TitleIcon={ChatBubbleBottomCenterTextIcon}
        open={isOpenDeleteCommentDialog}
        title='Delete Comment'
        content={
          <div>
            <div>Are you sure you want to delete this comment?</div>
          </div>
        }
        onClose={() => {
          setIsOpenDeleteCommentDialog(false);
        }}
        closeBtn={{
          label: 'Close',
          onClick: () => {
            setIsOpenDeleteCommentDialog(false);
          },
        }}
        confirmBtn={{ label: 'Delete Comment', onClick: handleDeleteComment }}
      />
    </div>
  );
};

export default SequenceRunTimeline;
