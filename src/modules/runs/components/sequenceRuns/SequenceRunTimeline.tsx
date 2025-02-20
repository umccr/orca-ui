import {
  useSequenceRunStateListModel,
  useSequenceRunCommentListModel,
  useSequenceRunCommentCreateModel,
  useSequenceRunCommentUpdateModel,
  useSequenceRunCommentDeleteModel,
} from '@/api/sequenceRun';
import { useState, useEffect, useMemo } from 'react';
import { dayjs } from '@/utils/dayjs';

import { getUsername } from '@/utils/commonUtils';
import { Timeline } from '@/components/common/timelines';
import { getBadgeStatusType, statusBackgroundColor } from '@/utils/statusUtils';
import { BackdropWithText } from '@/components/common/backdrop';
import { Button } from '@/components/common/buttons';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import toaster from '@/components/common/toaster';
import CommentDialog from '../common/CommentDialog';

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
      title: 'Status Updated',
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
      title: 'Comment Added',
      datetime: comment.updatedAt,
      iconBackground: 'bg-blue-100 dark:bg-blue-900',
      comment: comment.comment,
      actionsList: [
        {
          label: 'Update',
          onClick: () => {
            setCommentId(comment.orcabusId as string);
            setComment(comment.comment);
            setIsOpenUpdateCommentDialog(true);
          },
          icon: PencilIcon,
        },
        {
          label: 'Delete',
          onClick: () => {
            setCommentId(comment.orcabusId as string);
            setIsOpenDeleteCommentDialog(true);
          },
          icon: TrashIcon,
        },
      ],
      eventType: 'comment' as const,
      user: {
        name: getUsername(comment.createdBy || ''),
        // Optional: Add avatar if available
        // avatar: getUserAvatar(comment.createdBy)
      },
    }));
  }, [sequenceRunCommentsDetail]);

  const timelineData = useMemo(() => {
    return [
      ...(SequenceRunStateTimelineData || []),
      ...(SequenceRunCommentTimelineData || []),
    ].sort((a, b) => (dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? -1 : 1));
  }, [SequenceRunStateTimelineData, SequenceRunCommentTimelineData]);

  console.log(timelineData);

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
      <Timeline timeline={timelineData || [{ id: 'loading' }]} isCollapsed={true} />
      {/* comment dialog */}
      <CommentDialog
        isOpenAddCommentDialog={isOpenAddCommentDialog}
        isOpenUpdateCommentDialog={isOpenUpdateCommentDialog}
        isOpenDeleteCommentDialog={isOpenDeleteCommentDialog}
        comment={comment}
        setComment={setComment}
        handleClose={() => {
          setIsOpenAddCommentDialog(false);
          setIsOpenUpdateCommentDialog(false);
          setIsOpenDeleteCommentDialog(false);
          setComment('');
        }}
        handleAddComment={handleAddComment}
        handleUpdateComment={handleUpdateComment}
        handleDeleteComment={handleDeleteComment}
        user={user}
      />
    </div>
  );
};

export default SequenceRunTimeline;
