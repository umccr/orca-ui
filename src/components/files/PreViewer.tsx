import { useSuspenseQuery } from '@tanstack/react-query';
import { getMimeType, getPreSignedUrlData } from './utils';
import { usePresignedFileObjectId } from '@/api/file';
import { classNames } from '@/utils/commonUtils';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type Props = { s3ObjectId: string; s3Key: string };

export const PreViewer = ({ s3ObjectId, s3Key }: Props) => {
  const url = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
    headers: { 'Content-Type': getMimeType(s3Key) },
  }).data;
  if (!url) throw new Error('Unable to create presigned url');

  const data = useSuspenseQuery({
    queryKey: ['downloadPresignedData', url],
    queryFn: async () => {
      const data = await getPreSignedUrlData(url);
      return data;
    },
  }).data;
  if (!data) throw new Error('Unable to load data');

  // Sanitize and split string
  const sanitizeContent: string = data.replace(/\r\n/g, '\n');
  const allRows: string[] = sanitizeContent.split('\n');
  const viewableRows = allRows.slice(0, 1000);

  return (
    <div className='space-y-4'>
      {viewableRows.length > 1000 && (
        <div
          className={classNames(
            'flex items-center gap-2 rounded-lg p-3',
            'bg-amber-50 dark:bg-amber-900/30',
            'border border-amber-200 dark:border-amber-700',
            'text-amber-800 dark:text-amber-200'
          )}
        >
          <ExclamationTriangleIcon className='h-5 w-5 flex-shrink-0' />
          <p className='text-sm font-medium'>Only showing the first 1,000 rows for performance</p>
        </div>
      )}

      <div
        className={classNames(
          'overflow-hidden rounded-lg',
          'border border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-900',
          'shadow-sm'
        )}
      >
        <div
          className={classNames(
            'border-b px-4 py-2',
            'border-gray-200 dark:border-gray-700',
            'bg-gray-50 dark:bg-gray-800'
          )}
        >
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>File Preview</h3>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {s3Key.split('/').pop()}
            </span>
          </div>
        </div>

        <pre
          className={classNames(
            'm-0 overflow-auto p-4',
            'text-sm text-gray-800 dark:text-gray-200',
            'font-mono',
            'bg-white dark:bg-gray-900'
          )}
        >
          {viewableRows.join('\n')}
        </pre>
      </div>
    </div>
  );
};
