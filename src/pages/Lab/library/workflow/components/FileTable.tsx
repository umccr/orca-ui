import React, { useState } from 'react';
import { useFileObject } from '@/api/file';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { Bars3Icon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { IconDropdown } from '@/components/common/dropdowns';
import toaster from '@/components/common/toaster';
import { ToastContainer } from 'react-toastify';
import { getFilenameFromKey } from '@/utils/commonUtils';
import { FilePreviewDrawer } from './FilePreviewDrawer';
// import { FilePreviewDrawer } from './FilePreviewDrawer';

export const FileTable = ({ portalRunId }: { portalRunId: string }) => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const data = useFileObject({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { query: { page: page, rowsPerPage: rowsPerPage, portalRunId: portalRunId } as any },
  }).data;

  return (
    <Table
      columns={tableColumn}
      tableData={data.results.map((item) => ({
        ...item,
        objectInfo: { s3Key: item.key, bucket: item.bucket },
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
    accessor: 'key',
    cell: (data: unknown) => {
      return <div>{getFilenameFromKey(data as string)}</div>;
    },
  },
  {
    header: '',
    accessor: 'objectInfo',
    cell: (data: unknown) => {
      const { s3Key, bucket } = data as { s3Key: string; bucket: string };

      return <FilePreviewDrawer s3Key={s3Key} bucket={bucket} />;
    },
  },
  {
    header: 'Action button',
    accessor: 'objectInfo',
    cell: (data: unknown) => {
      const { s3Key, bucket } = data as { s3Key: string; bucket: string };
      return <DataActionButton s3Key={s3Key} bucket={bucket} />;
    },
  },
  {
    header: 'Size',
    accessor: 'size',
    cell: (data: unknown) => {
      return <div>{humanFileSize(data as number)}</div>;
    },
  },
  {
    header: 'Last Modified Date ',
    accessor: 'last_modified_date',
    cell: (data: unknown) => {
      return <div className=''>{data ? dayjs(data as string).format('lll Z') : '-'}</div>;
    },
  },
];

const DataActionButton = ({ s3Key, bucket }: { s3Key: string; bucket: string }) => {
  const s3Uri = `s3://${bucket}/${s3Key}`;

  return (
    <>
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
        ]}
        BtnIcon={Bars3Icon}
      />
    </>
  );
};
