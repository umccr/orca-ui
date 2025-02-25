import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSequenceRunContext } from './SequenceRunContext';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { classNames } from '@/utils/commonUtils';
import Skeleton from 'react-loading-skeleton';
import { Button } from '@/components/common/buttons';
import { DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import CommentDialog from '../common/CommentDialog';
import FileViewDialog from '../common/FileViewDialog';
import {
  useSequenceRunCommentCreateModel,
  useSequenceRunSampleSheetModel,
} from '@/api/sequenceRun';
import toaster from '@/components/common/toaster';
import { keepPreviousData } from '@tanstack/react-query';
const SequenceRunDetailsHeader = () => {
  const { user } = useAuthContext();
  const { orcabusId } = useParams();
  const { sequenceRunDetail, isFetchingSequenceRunDetail, refetchSequenceRunComment } =
    useSequenceRunContext();

  const [isOpenAddCommentDialog, setIsOpenAddCommentDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [isOpenFileViewDialog, setIsOpenFileViewDialog] = useState(false);
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

  const {
    data: sampleSheetData,

    isPending: isPendingSampleSheet,

    isError: isErrorSampleSheet,
    error: errorSampleSheet,
  } = useSequenceRunSampleSheetModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId && isOpenFileViewDialog,
      placeholderData: keepPreviousData,
    },
  });

  if (isErrorSampleSheet) {
    toaster.error({ title: 'Error fetching sample sheet' });
    throw errorSampleSheet;
  }

  const sampleSheetName = (sampleSheetData?.sampleSheetName || 'Sample Sheet') as string;
  const sampleSheetContent = (
    sampleSheetData?.sampleSheetContent
      ? atob(sampleSheetData.sampleSheetContent as string)
      : 'sample sheet content'
  ) as string;

  return (
    <div className={classNames('flex w-full flex-col gap-3', 'bg-white dark:bg-gray-800')}>
      {/* title */}

      {/* header: workflow run name */}
      {isFetchingSequenceRunDetail ? (
        <div className='flex-1'>
          <Skeleton height={20} />
        </div>
      ) : (
        <div>
          <div className='flex items-center justify-between py-4'>
            <div className='flex flex-col'>
              <h1 className='truncate text-xl font-semibold text-gray-900 dark:text-white'>
                {sequenceRunDetail?.sequenceRunName}
              </h1>
            </div>
          </div>
          <div className='flex flex-col gap-2 py-2'>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Workflow Run Actions</p>
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                type='gray'
                size='xs'
                rounded
                onClick={() => {
                  setIsOpenFileViewDialog(true);
                }}
                disabled={false}
                className={classNames(
                  'flex items-center gap-2',
                  'border border-gray-200 dark:border-gray-700',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'rounded-lg px-4 py-2',
                  'shadow-sm'
                )}
              >
                <DocumentTextIcon className='h-4 w-4' />
                View Sample sheet
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
        </div>
      )}

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

      {/* file view dialog */}
      <FileViewDialog
        isOpenFileViewDialog={isOpenFileViewDialog}
        setIsOpenFileViewDialog={setIsOpenFileViewDialog}
        fileName={sampleSheetName}
        fileContent={sampleSheetContent}
        isLoading={isPendingSampleSheet}
      />
    </div>
  );
};

export default SequenceRunDetailsHeader;
