import {
  useSequenceRunStateListModel,
  useSequenceRunCommentListModel,
  useSequenceRunCommentCreateModel,
  useSequenceRunCommentUpdateModel,
  useSequenceRunCommentDeleteModel,
} from '@/api/sequenceRun';
import { useState, useEffect, useMemo, FC } from 'react';
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
import { useParams } from 'react-router-dom';

interface SequenceRunTimelineProps {
  hasAddCommentBtn?: boolean;
  selectedSequenceRunId?: string;
}

const SequenceRunTimeline: FC<SequenceRunTimelineProps> = ({
  hasAddCommentBtn = true,
  selectedSequenceRunId,
}) => {
  const { user } = useAuthContext();
  const { orcabusId } = useParams();
  const [isOpenAddCommentDialog, setIsOpenAddCommentDialog] = useState<boolean>(false);
  const [isOpenUpdateCommentDialog, setIsOpenUpdateCommentDialog] = useState<boolean>(false);
  const [isOpenDeleteCommentDialog, setIsOpenDeleteCommentDialog] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  const sequenceRunId = selectedSequenceRunId || orcabusId;
  const { data: sequenceRunStateDetail, isFetching: isFetchingSequenceRunStateDetail } =
    useSequenceRunStateListModel({
      params: { path: { orcabusId: sequenceRunId as string } },
      reactQuery: {
        enabled: !!sequenceRunId,
      },
    });

  const {
    data: sequenceRunCommentsDetail,
    isFetching: isFetchingSequenceRunComments,
    refetch: refetchSequenceRunComment,
  } = useSequenceRunCommentListModel({
    params: { path: { orcabusId: sequenceRunId as string } },
    reactQuery: {
      enabled: !!sequenceRunId,
    },
  });

  const SequenceRunStateTimelineData = useMemo(() => {
    return sequenceRunStateDetail
      ? sequenceRunStateDetail?.map((state) => ({
          id: state.orcabusId || '',
          title: 'Status Updated',
          datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm'),
          comment: state.comment || '',
          status: state.status,
          iconBackground: statusBackgroundColor(getBadgeStatusType(state.status)),
          payloadId: '',
          eventType: 'stateChange' as const,
        }))
      : [];
  }, [sequenceRunStateDetail]);

  const SequenceRunCommentTimelineData = useMemo(() => {
    return sequenceRunCommentsDetail
      ? sequenceRunCommentsDetail?.map((comment) => ({
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
        }))
      : [];
  }, [sequenceRunCommentsDetail]);

  const timelineData = useMemo(() => {
    return [...SequenceRunStateTimelineData, ...SequenceRunCommentTimelineData].sort((a, b) =>
      dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? -1 : 1
    );
  }, [SequenceRunStateTimelineData, SequenceRunCommentTimelineData]);

  const {
    mutate: createSequenceRunComment,
    isSuccess: isCreatedSequenceRunComment,
    isError: isErrorCreatingSequenceRunComment,
    reset: resetCreateSequenceRunComment,
  } = useSequenceRunCommentCreateModel({
    params: { path: { orcabusId: sequenceRunId as string } },
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
    params: { path: { orcabusId: sequenceRunId as string, id: commentId as string } },
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
    params: { path: { orcabusId: sequenceRunId as string, id: commentId as string } },
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
    <div className='h-full gap-4 px-4 pb-2'>
      {(isFetchingSequenceRunStateDetail || isFetchingSequenceRunComments) && (
        <BackdropWithText text='Loading Timeline data...' />
      )}
      <div className='flex h-full flex-col gap-4'>
        {hasAddCommentBtn && (
          <div className='flex flex-row py-2'>
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
        )}
        <div className='h-full overflow-visible'>
          <Timeline timelineEvents={timelineData} isCollapsed={false} />
        </div>
      </div>

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
