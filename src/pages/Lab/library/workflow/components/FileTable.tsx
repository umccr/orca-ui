import React, { useState } from 'react';
import { S3Record, useFileObject } from '@/api/file';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { IconDropdown } from '@/components/common/dropdowns';
import toaster from '@/components/common/toaster';
import { ToastContainer } from 'react-toastify';
import { getFilenameFromKey } from '@/utils/commonUtils';
import { FilePreviewDrawer } from './FilePreviewDrawer';
import { Dialog } from '@/components/dialogs';
import { JsonToTable } from '@/components/common/json-to-table';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FileTable = ({ portalRunId }: { portalRunId: string }) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchBox, setSearchBox] = useState<string>('');
  const [dataQueryParams, setDataQueryParams] = useState<Record<string, string>>({});

  const data = useFileObject({
    params: {
      query: {
        ...dataQueryParams,
        page: page,
        rowsPerPage: rowsPerPage,
        currentState: true,
      },
    },
  }).data;

  if (!data) throw new Error('Data is not available');

  return (
    <Table
      columns={tableColumn}
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex flex-1 items-center justify-start pt-2'>
            <div className='w-full'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  onBlur={() => {
                    setDataQueryParams({ key: searchBox });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setDataQueryParams({ key: searchBox });
                    }
                  }}
                  onChange={(e) => {
                    setSearchBox(e.target.value.trim());
                    if (!e.target.value) {
                      setDataQueryParams({});
                    }
                  }}
                  value={searchBox}
                  id='search'
                  name='search'
                  className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  placeholder='Search (Object key)'
                  type='search'
                />
              </div>
            </div>
          </div>
        </div>
      }
      tableData={data.results.map((item) => ({
        lastModifiedDate: item.lastModifiedDate,
        size: item.size,
        fileRecord: item,
      }))}
      paginationProps={{
        totalCount: data.pagination.count ?? 0,
        rowsPerPage: data.pagination.rowsPerPage ?? 0,
        currentPage: data.pagination.page ?? 0,
        setPage: (n: number) => {
          setPage(n);
        },
        countUnit: 'files',
        setRowsPerPage: (n) => {
          setRowsPerPage(n);
        },
      }}
    />
  );
};

/**
 * Convert bytes to human readable file size
 * @param bytes
 * @param dp decimal place
 * @returns
 */
const humanFileSize = (bytes: number): string => {
  const thresh = 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  let u = -1;
  const r = 10;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed() + ' ' + units[u];
};

/**
 * Table Columns Properties
 */
const tableColumn: Column[] = [
  {
    header: 'Filename',
    accessor: 'fileRecord',
    cell: (data: unknown) => {
      const { key } = data as { key: string };
      return <div>{getFilenameFromKey(key)}</div>;
    },
  },
  {
    header: '',
    accessor: 'fileRecord',
    cell: (data: unknown) => {
      const { key: s3Key, bucket, s3ObjectId } = data as S3Record;

      return <FilePreviewDrawer s3Key={s3Key} bucket={bucket} s3ObjectId={s3ObjectId} />;
    },
  },
  {
    header: 'Action button',
    accessor: 'fileRecord',
    cell: (data: unknown) => {
      return <DataActionButton fileRecord={data as S3Record} />;
    },
  },
  {
    header: 'Size',
    accessor: 'size',
    cell: (data: unknown) => {
      return <div>{data ? humanFileSize(data as number) : '-'}</div>;
    },
  },
  {
    header: 'Last Modified Date ',
    accessor: 'lastModifiedDate',
    cell: (data: unknown) => {
      return <div className=''>{data ? dayjs(data as string).format('lll Z') : '-'}</div>;
    },
  },
];

const DataActionButton = ({ fileRecord }: { fileRecord: S3Record }) => {
  const { key: s3Key, bucket } = fileRecord;
  const s3Uri = `s3://${bucket}/${s3Key}`;

  const [isOpenRecordDetails, setIsOpenRecordDetails] = useState(false);
  return (
    <>
      {isOpenRecordDetails && (
        <Dialog
          open={isOpenRecordDetails}
          title='Record Details'
          content={<JsonToTable data={fileRecord} />}
          onClose={() => setIsOpenRecordDetails(false)}
          closeBtn={{ label: 'Close', onClick: () => setIsOpenRecordDetails(false) }}
        />
      )}
      <ToastContainer />
      <IconDropdown
        className='size-8 items-center justify-center'
        items={[
          {
            label: 'Copy S3 URI',
            onClick: () => {
              navigator.clipboard.writeText(s3Uri);
              toaster.success({ title: 'S3 URI Copied!' });
            },
          },
          {
            label: 'Generate download link',
            onClick: () => console.log('download link'),
            disabled: true,
          },
          {
            label: 'View record details',
            onClick: () => {
              setIsOpenRecordDetails(true);
            },
          },
        ]}
        BtnIcon={Bars3Icon}
      />
    </>
  );
};
