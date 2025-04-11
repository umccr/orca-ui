import { useSuspenseQuery } from '@tanstack/react-query';
import { getMimeType, getPreSignedUrlData } from './utils';
import { useState } from 'react';
import { Table } from '../tables';
import { Column } from '../tables/Table';
import { usePresignedFileObjectId } from '@/api/file';
import { classNames } from '@/utils/commonUtils';
import { TableCellsIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type Props = { s3ObjectId: string; s3Key: string };

export const TableViewer = ({ s3ObjectId, s3Key }: Props) => {
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

  const [isPrettify, setIsPrettify] = useState(true);
  if (!s3Key.endsWith) throw new Error('No Data');

  let delimiter = '';
  if (s3Key.endsWith('tsv')) delimiter = '\t';
  if (s3Key.endsWith('csv')) delimiter = ',';

  // Sanitize and split string
  const sanitizeContent: string = data.replace(/\r\n/g, '\n');
  const allRows: string[] = sanitizeContent.split('\n');
  const viewableRows = allRows.slice(0, 1000);
  const headerRow: string[] = allRows[0].split(delimiter);

  const jsonData = viewableRows.slice(1).map((row, idx) => {
    const values = row.split(delimiter);
    const obj: Record<string, string> = { rowNum: (idx + 2).toString() };
    for (let index = 0; index < headerRow.length; index++) {
      const header = headerRow[index];
      obj[header] = values[index];
    }
    return obj;
  });

  const headerTableProps: Column[] = headerRow.map((colName) => ({
    accessor: colName,
    header: colName,
  }));

  headerTableProps.unshift({
    accessor: 'rowNum',
    header: <pre className='border-r border-gray-200 pr-3 dark:border-gray-700'>{1}</pre>,
    cell: (data) => (
      <pre className='border-r border-gray-200 pr-3 text-gray-600 dark:border-gray-700 dark:text-gray-300'>
        {data as string}
      </pre>
    ),
  });

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
            <TableCellsIcon className='h-4 w-4 text-gray-500 dark:text-gray-400' />
            <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>Table Preview</h3>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {s3Key.split('/').pop()}
            </span>
            <div className='flex items-center gap-2'>
              <input
                id='view-toggle'
                type='checkbox'
                onChange={(e) => setIsPrettify(e.target.checked)}
                checked={isPrettify}
                className={classNames(
                  'h-4 w-4 rounded',
                  'border-gray-300 dark:border-gray-600',
                  'bg-gray-100 dark:bg-gray-700',
                  'text-blue-600 dark:text-blue-500',
                  'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600',
                  'transition-colors duration-200'
                )}
              />
              <label
                htmlFor='view-toggle'
                className='cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300'
              >
                Table View
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='space-y-4 p-4'>
        {allRows.length > 1000 && (
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
            'bg-white dark:bg-gray-900'
          )}
        >
          {isPrettify ? (
            <div className='overflow-auto'>
              <Table tableData={jsonData} columns={headerTableProps} />
            </div>
          ) : (
            <pre
              className={classNames(
                'm-0 overflow-auto p-4',
                'font-mono text-sm',
                'text-gray-800 dark:text-gray-200',
                'bg-white dark:bg-gray-900'
              )}
            >
              {viewableRows.join('\n')}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
