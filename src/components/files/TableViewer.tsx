import { useSuspenseQuery } from '@tanstack/react-query';
import { generatePresignedUrl, getPreSignedUrlData } from './utils';
import { useState } from 'react';
import { Table } from '../tables';
import { Column } from '../tables/Table';

type Props = { bucket: string; s3Key: string };
export const TableViewer = ({ bucket, s3Key: key }: Props) => {
  const [isPrettify, setIsPrettify] = useState(true);
  const data = useSuspenseQuery({
    queryKey: ['generatePresignedUrl', { bucket, key }],
    queryFn: async () => {
      const url = await generatePresignedUrl({ bucket, key });
      const data = await getPreSignedUrlData(url);

      return data;
    },
  }).data;

  if (!key.endsWith) throw new Error('No Data');

  let delimiter = '';
  if (key.endsWith('tsv')) delimiter = '\t';
  if (key.endsWith('csv')) delimiter = ',';

  // Sanitize and split string
  const sanitizeContent: string = data.replace(/\r\n/g, '\n');
  const allRows: string[] = sanitizeContent.split('\n');
  const headerRow: string[] = allRows[0].split(delimiter);

  const jsonData = allRows.slice(1).map((row, idx) => {
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
    <div className='w-full h-full flex flex-col'>
      <div className='flex items-center'>
        <input
          id='default-checkbox'
          type='checkbox'
          onChange={(e) => setIsPrettify(e.target.checked)}
          checked={isPrettify}
          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
        />
        <label className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
          Table View
        </label>
      </div>

      {isPrettify ? (
        <Table tableData={jsonData} columns={headerTableProps} />
      ) : (
        <pre
          className='overflow-auto inline-block m-0 mt-4 p-3 w-full bg-white border border-solid border-current border-round-xs'
          style={{
            minWidth: '50vw',
          }}
        >
          {data}
        </pre>
      )}
    </div>
  );
};
