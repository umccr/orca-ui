import {
  useSequenceRunCommentUpdateModel,
  useSequenceRunCommentDeleteModel,
  useSequenceRunStateUpdateModel,
} from '@/api/sequenceRun';
import { useState, useEffect, useMemo, FC } from 'react';
import { dayjs } from '@/utils/dayjs';
import { classNames, getUsername } from '@/utils/commonUtils';
import { Timeline } from '@/components/common/timelines';
import { getBadgeStatusType, statusBackgroundColor } from '@/utils/statusUtils';
import { BackdropWithText } from '@/components/common/backdrop';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import toaster from '@/components/common/toaster';
import CommentDialog from '../common/CommentDialog';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/common/buttons';
import { BarsArrowUpIcon, BarsArrowDownIcon } from '@heroicons/react/24/outline';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import StateDialog from '../common/StateDialog';
import { useSequenceRunContext } from './SequenceRunContext';

interface SequenceRunTimelineProps {
  selectedSequenceRunId?: string;
}

const SequenceRunTimeline: FC<SequenceRunTimelineProps> = ({ selectedSequenceRunId }) => {
  const { user } = useAuthContext();
  const { orcabusId } = useParams();

  const {
    sequenceRunDetail,
    sequenceRunStateData,
    isFetchingSequenceRunState,
    refetchSequenceRunState,
    sequenceRunCommentData,
    isFetchingSequenceRunComment,
    refetchSequenceRunComment,
    sequenceRunStateValidMapData,
    isFetchingSequenceRunStateValidMap,
  } = useSequenceRunContext();

  // comment dialog
  const [isOpenUpdateCommentDialog, setIsOpenUpdateCommentDialog] = useState<boolean>(false);
  const [isOpenDeleteCommentDialog, setIsOpenDeleteCommentDialog] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  // state dialog
  const [isOpenUpdateStateDialog, setIsOpenUpdateStateDialog] = useState<boolean>(false);
  const [stateId, setStateId] = useState<string | null>(null);
  const [stateComment, setStateComment] = useState<string>('');

  const [isReverseOrder, setIsReverseOrder] = useLocalStorage(
    'sequence-run-timeline-reverse-order',
    false
  );

  const sequenceRunId = selectedSequenceRunId || orcabusId;

  const SequenceRunStateTimelineData = useMemo(() => {
    return sequenceRunStateData
      ? sequenceRunStateData?.map((state) => ({
          id: state.orcabusId || '',
          title: 'Status Updated',
          actionsList: Object.keys(sequenceRunStateValidMapData || {}).includes(state.status)
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
          datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm'),
          comment: state.comment || '',
          status: state.status,
          iconBackground: statusBackgroundColor(getBadgeStatusType(state.status)),
          payloadId: '',
          eventType: 'stateChange' as const,
        }))
      : [];
  }, [sequenceRunStateData, sequenceRunStateValidMapData]);

  const SequenceRunCommentTimelineData = useMemo(() => {
    return sequenceRunCommentData
      ? sequenceRunCommentData?.map((comment) => ({
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
  }, [sequenceRunCommentData]);

  const timelineData = [...SequenceRunStateTimelineData, ...SequenceRunCommentTimelineData].sort(
    (a, b) => (dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? -1 : 1)
  );

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

  const {
    mutate: updateSequenceRunState,
    isSuccess: isUpdatedSequenceRunState,
    isError: isErrorUpdatingSequenceRunState,
    reset: resetUpdateSequenceRunState,
  } = useSequenceRunStateUpdateModel({
    params: { path: { orcabusId: sequenceRunId as string, id: stateId as string } },
    body: {
      comment: stateComment,
    },
  });

  const handleUpdateState = () => {
    updateSequenceRunState();
    setIsOpenUpdateStateDialog(false);
  };

  useEffect(() => {
    if (isUpdatedSequenceRunState) {
      toaster.success({ title: 'State updated successfully' });
      refetchSequenceRunState();
      resetUpdateSequenceRunState();
    }

    if (isErrorUpdatingSequenceRunState) {
      toaster.error({ title: 'Error updating state' });
      resetUpdateSequenceRunState();
    }
  }, [
    isUpdatedSequenceRunState,
    refetchSequenceRunState,
    resetUpdateSequenceRunState,
    isErrorUpdatingSequenceRunState,
  ]);

  const isFetching =
    isFetchingSequenceRunState ||
    isFetchingSequenceRunComment ||
    isFetchingSequenceRunStateValidMap;

  return (
    <div className='h-full gap-4 px-4 pb-2'>
      {isFetching && <BackdropWithText text='Loading Timeline data...' />}
      <div className='flex h-full flex-col gap-4'>
        {/* timeline header part */}
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Timeline</h2>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {timelineData.length} events
            </span>
          </div>
          <div className='flex items-center gap-2'>
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
        {/* content part */}
        <div className='h-full overflow-visible'>
          <Timeline
            timelineEvents={isReverseOrder ? timelineData.reverse() : timelineData}
            isCollapsed={false}
          />
        </div>
      </div>

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
      <StateDialog
        isOpenAddStateDialog={false}
        isOpenUpdateStateDialog={isOpenUpdateStateDialog}
        user={user}
        currentState={sequenceRunDetail?.status as string | null}
        handleClose={() => {
          setIsOpenUpdateStateDialog(false);
        }}
        stateComment={stateComment}
        setStateComment={setStateComment}
        handleStateCreationEvent={() => {}}
        handleUpdateState={handleUpdateState}
      />
    </div>
  );
};

export default SequenceRunTimeline;
