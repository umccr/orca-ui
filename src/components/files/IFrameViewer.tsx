import { usePresignedFileObjectId } from '@/api/file';
import { getMimeType } from './utils';
import { classNames } from '@/utils/commonUtils';
import { DocumentIcon } from '@heroicons/react/24/outline';

type Props = { s3ObjectId: string; s3Key: string };

export const IFrameViewer = ({ s3ObjectId, s3Key }: Props) => {
  const url = usePresignedFileObjectId({
    params: {
      path: { id: s3ObjectId },
      query: { responseContentDisposition: 'inline' },
    },
    headers: { 'Content-Type': getMimeType(s3Key) },
  }).data;

  if (!url) throw new Error('Unable to create presigned url');

  return (
    <div
      className={classNames(
        'h-full w-full',
        'overflow-hidden rounded-lg',
        'border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-900',
        'shadow-sm'
      )}
    >
      {/* Header */}
      <div
        className={classNames(
          'border-b px-4 py-2',
          'border-gray-200 dark:border-gray-700',
          'bg-gray-50 dark:bg-gray-800'
        )}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <DocumentIcon className='h-4 w-4 text-gray-500 dark:text-gray-400' />
            <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              Document Preview
            </h3>
          </div>
          <span className='text-xs text-gray-500 dark:text-gray-400'>{s3Key.split('/').pop()}</span>
        </div>
      </div>

      {/* Content */}
      <div className='relative h-[calc(100%-2.5rem)] w-full'>
        <iframe
          className={classNames(
            'absolute inset-0 h-full w-full',
            'bg-white dark:bg-gray-900',
            'border-0'
          )}
          src={url}
          title={`Preview of ${s3Key.split('/').pop()}`}
        />
      </div>
    </div>
  );
};
