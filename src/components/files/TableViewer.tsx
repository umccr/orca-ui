import { useSuspenseQuery } from '@tanstack/react-query';
import { getMimeType, getPreSignedUrlData } from './utils';
import { useState } from 'react';
import { Table } from '../tables';
import { Column } from '../tables/Table';
import { usePresignedFileObjectId } from '@/api/file';

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
    // Split each row by commas to get the individual cell values
    const values = row.split(delimiter);

    // Map the cell values to the corresponding column names
    // Adding row number for each row, the content of table start at row 2
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
    header: <pre className='border-r-2 pr-3'>{1}</pre>,
    cell: (data) => <pre className='border-r-2 pr-3'>{data as string}</pre>,
  });

  return (
    <div className='mb-2 flex h-full w-full flex-col'>
      {allRows.length > 1000 && (
        <div className='mb-3 w-full border bg-amber-100 p-2 text-amber-700'>
          Only showing the first 1000 rows
        </div>
      )}
      <div className='flex items-center'>
        <input
          id='default-checkbox'
          type='checkbox'
          onChange={(e) => setIsPrettify(e.target.checked)}
          checked={isPrettify}
          className='h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
        />
        <label className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
          Table View
        </label>
      </div>

      {isPrettify ? (
        <Table tableData={jsonData} columns={headerTableProps} />
      ) : (
        <pre className='border-round-xs m-0 mt-4 inline-block w-full overflow-auto border border-solid border-current bg-white p-3'>
          {viewableRows.join('\n')}
        </pre>
      )}
    </div>
  );
};
