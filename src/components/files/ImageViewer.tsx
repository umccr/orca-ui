import { usePresignedFileObjectId } from '@/api/file';
import { getMimeType } from './utils';
import { classNames } from '@/utils/commonUtils';
import { PhotoIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

type Props = { s3ObjectId: string; s3Key: string };

export const ImageViewer = ({ s3ObjectId, s3Key }: Props) => {
  const url = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
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
            <PhotoIcon className='h-4 w-4 text-gray-500 dark:text-gray-400' />
            <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>Image Preview</h3>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {s3Key.split('/').pop()}
            </span>
            <button
              onClick={() => window.open(url, '_blank')}
              className={classNames(
                'rounded-md p-1',
                'text-gray-500 hover:text-gray-700',
                'dark:text-gray-400 dark:hover:text-gray-200',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'transition-all duration-200'
              )}
              title='Open in new tab'
            >
              <ArrowTopRightOnSquareIcon className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={classNames(
          'relative h-[calc(100%-2.5rem)]',
          'flex items-center justify-center',
          'p-4',
          'bg-gray-50 dark:bg-gray-800/50',
          'overflow-auto'
        )}
      >
        <img
          className={classNames(
            'max-h-full max-w-full',
            'object-contain',
            'rounded shadow-sm',
            'bg-white dark:bg-gray-900',
            'transition-transform duration-200 hover:scale-[1.02]'
          )}
          src={url}
          alt={s3Key.split('/').pop()}
          onClick={() => window.open(url, '_blank')}
        />
      </div>
    </div>
  );
};
