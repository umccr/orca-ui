import React, { useEffect, useState } from 'react';
import { S3Record, useSuspenseFileObject, useQueryPresignedFileObjectId } from '@/api/file';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { IconDropdown } from '@/components/common/dropdowns';
import toaster from '@/components/common/toaster';
import { FilePreviewDrawer } from './FilePreviewDrawer';
import { Dialog } from '@/components/dialogs';
import { JsonToTable } from '@/components/common/json-to-table';
import { FileDownloadButton } from './FileDownloadButton';
import { DOWNLOADABLE_FILETYPE_LIST } from '@/components/files';
import { getFilenameFromKey } from '@/utils/commonUtils';
import { useQueryParams } from '@/hooks/useQueryParams';

export const FileAPITable = ({
  additionalQueryParam,
  tableColumn = getTableColumn({}),
  isSearchBoxKey,
}: {
  isSearchBoxKey?: boolean;
  tableColumn?: Column[];
  additionalQueryParam?: Record<string, string>;
}) => {
  const [searchBox, setSearchBox] = useState('');

  const { setQueryParams, getPaginationParams } = useQueryParams();

  const data = useSuspenseFileObject({
    params: {
      query: {
        currentState: true,
        key: searchBox == '' ? undefined : `*${searchBox}*`,
        ...getPaginationParams(),
        ...additionalQueryParam,
      },
    },
  }).data;

  if (!data) throw new Error('Data is not available');

  return (
    <Table
      columns={tableColumn}
      tableHeader={isSearchBoxKey && <SearchBox onSearch={(s) => setSearchBox(s)} />}
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
          setQueryParams({ page: n });
        },
        countUnit: 'files',
        setRowsPerPage: (n) => {
          setQueryParams({ rowsPerPage: n });
        },
      }}
    />
  );
};

export const SearchBox = ({
  initValue = '',
  placeholder = 'Search',
  onSearch,
}: {
  initValue?: string;
  placeholder?: string;
  onSearch: (s: string) => void;
}) => {
  const [searchBox, setSearchBox] = useState<string>(initValue);

  return (
    <div className='flex flex-col md:flex-row font-normal'>
      <div className='flex flex-col flex-1 items-start pt-2'>
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
                onSearch(`${searchBox}`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch(`${searchBox}`);
                }
              }}
              onChange={(e) => {
                setSearchBox(e.target.value.trim());
                if (!e.target.value) {
                  onSearch('');
                }
              }}
              value={searchBox}
              id='search'
              name='search'
              className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder={placeholder}
              type='search'
            />
          </div>
        </div>
        <div className='text-xs italic font-light my-2'>
          The search matches values within S3 keys. Use an asterisk (*) as a wildcard to match any
          sequence of characters. An asterisk is added at the beginning and end of the search term.
        </div>
      </div>
    </div>
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

  return bytes.toFixed(2) + ' ' + units[u];
};

/**
 * Table Columns Properties
 * @param isHideKeyPrefix Show filename as one of the column, else it shows the S3 key
 * @returns
 */
export const getTableColumn = ({
  isHideKeyPrefix = true,
}: {
  isHideKeyPrefix?: boolean;
}): Column[] => {
  const col = [
    {
      header: '',
      accessor: 'fileRecord',
      cell: (data: unknown) => {
        const { key: s3Key } = data as S3Record;

        const splitPath = s3Key.split('.');
        const filetype = splitPath[splitPath.length - 1].toLowerCase();
        const isDownloadable = DOWNLOADABLE_FILETYPE_LIST.includes(filetype);

        return (
          <div className='flex flex-row justify-end'>
            {isDownloadable && <FileDownloadButton s3Record={data as S3Record} />}
            <FilePreviewDrawer s3Record={data as S3Record} />
          </div>
        );
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

  if (isHideKeyPrefix) {
    col.unshift({
      header: 'Filename',
      accessor: 'fileRecord',
      cell: (data: unknown) => {
        const { key } = data as { key: string };
        return <div>{getFilenameFromKey(key)}</div>;
      },
    });
  } else {
    col.unshift({
      header: 'Key',
      accessor: 'fileRecord',
      cell: (data: unknown) => {
        const { key } = data as { key: string };
        return <div>{key}</div>;
      },
    });
  }

  return col;
};

/**
 * The action button for each row in the table
 * @param param0
 * @returns
 */
const DataActionButton = ({ fileRecord }: { fileRecord: S3Record }) => {
  const { key: s3Key, bucket, s3ObjectId } = fileRecord;

  const s3Uri = `s3://${bucket}/${s3Key}`;

  const splitPath = s3Key.split('.');
  const filetype = splitPath[splitPath.length - 1].toLowerCase();
  const isDownloadable = DOWNLOADABLE_FILETYPE_LIST.includes(filetype);

  const [isOpenRecordDetails, setIsOpenRecordDetails] = useState(false);
  const [isGenerateDownloadableLink, setIsGenerateDownloadableLink] = useState(false);

  const { data: url } = useQueryPresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'attachment' } },
    reactQuery: { enabled: isGenerateDownloadableLink },
  });

  useEffect(() => {
    if (url && isGenerateDownloadableLink) {
      navigator.clipboard.writeText(url);
      toaster.success({ title: 'Presigned URL copied!' });
      setIsGenerateDownloadableLink(false);
    }
  }, [url, isGenerateDownloadableLink]);

  const iconDropdownItems = [
    {
      label: 'Copy S3 URI',
      onClick: () => {
        navigator.clipboard.writeText(s3Uri);
        toaster.success({ title: 'S3 URI Copied!' });
      },
    },
  ];

  if (isDownloadable) {
    iconDropdownItems.push({
      label: 'Generate download link',
      onClick: () => {
        if (url) {
          navigator.clipboard.writeText(url);
          toaster.success({ title: 'Presigned URL copied!' });
        } else {
          setIsGenerateDownloadableLink(true);
        }
      },
    });
  }

  iconDropdownItems.push({
    label: 'View record details',
    onClick: () => {
      setIsOpenRecordDetails(true);
    },
  });

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

      <IconDropdown
        className='size-8 items-center justify-center'
        items={iconDropdownItems}
        BtnIcon={Bars3Icon}
      />
    </>
  );
};
