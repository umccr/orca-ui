import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSequenceRunContext } from './SequenceRunContext';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { classNames } from '@/utils/commonUtils';
import { Button } from '@/components/common/buttons';
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import CommentDialog from '../common/CommentDialog';
import StateDialog from '../common/StateDialog';
import {
  useSequenceRunCommentCreateModel,
  useSequenceRunStateCreateModel,
} from '@/api/sequenceRun';
import toaster from '@/components/common/toaster';

const SequenceRunDetailsActions = () => {
  const { user } = useAuthContext();
  const { orcabusId } = useParams();
  const {
    sequenceRunDetail,
    refetchSequenceRunComment,
    sequenceRunStateValidMapData,
    refetchSequenceRunState,
  } = useSequenceRunContext();

  // comment dialog
  const [isOpenAddCommentDialog, setIsOpenAddCommentDialog] = useState(false);
  const [comment, setComment] = useState('');

  const {
    mutate: createSequenceRunComment,
    isSuccess: isCreatedSequenceRunComment,
    isError: isErrorCreatingSequenceRunComment,
    reset: resetCreateSequenceRunComment,
  } = useSequenceRunCommentCreateModel({
    params: { path: { orcabusId: orcabusId as string } },
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

  // state dialog
  const [isOpenAddStateDialog, setIsOpenAddStateDialog] = useState<boolean>(false);
  const [stateStatus, setStateStatus] = useState<string | null>(null);
  const [stateComment, setStateComment] = useState<string>('');

  const {
    mutate: createSequenceRunState,
    isSuccess: isCreatedSequenceRunState,
    isError: isErrorCreatingSequenceRunState,
    reset: resetCreateSequenceRunState,
  } = useSequenceRunStateCreateModel({
    params: { path: { orcabusId: orcabusId as string } },
    body: {
      status: stateStatus,
      comment: stateComment,
      createdBy: user?.email,
    },
  });

  const handleStateCreationEvent = () => {
    createSequenceRunState();
    setIsOpenAddStateDialog(false);
  };

  useEffect(() => {
    if (isCreatedSequenceRunState) {
      toaster.success({ title: 'State added successfully' });
      refetchSequenceRunState();
      resetCreateSequenceRunState();
      setStateStatus(null);
      setStateComment('');
    }

    if (isErrorCreatingSequenceRunState) {
      toaster.error({ title: 'Error adding state' });
      resetCreateSequenceRunState();
    }
  }, [
    isCreatedSequenceRunState,
    refetchSequenceRunState,
    resetCreateSequenceRunState,
    isErrorCreatingSequenceRunState,
  ]);

  const validStateOptions = useMemo(() => {
    return Object.entries(sequenceRunStateValidMapData || {})
      .filter(([, value]) => (value as string[]).includes(sequenceRunDetail?.status as string))
      .map(([key]) => key);
  }, [sequenceRunStateValidMapData, sequenceRunDetail]);

  return (
    <div className={classNames('flex w-full flex-col gap-3', 'bg-white dark:bg-gray-900')}>
      <div className='flex flex-col gap-2 py-2'>
        <div className='flex flex-wrap items-center gap-2'>
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
        </div>
      </div>

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
      <StateDialog
        isOpenAddStateDialog={isOpenAddStateDialog}
        isOpenUpdateStateDialog={false}
        user={user}
        validStatesToCreate={validStateOptions}
        selectedState={stateStatus}
        setSelectedState={setStateStatus}
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

export default SequenceRunDetailsActions;
