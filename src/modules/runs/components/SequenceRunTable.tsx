import { useSequenceRunListModel } from '@/api/sequenceRun';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useEffect, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { dayjs } from '@/utils/dayjs';
import { TableCellsIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/common/badges';

const SequenceRunTable = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const [searchBox, setSearchBox] = useState<string>('');
  const [dataQueryParams, setDataQueryParams] = useState<Record<string, string>>({});

  const onChangeParams = async () => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
    // console.log('onChangeParams', getQueryParams());
  };
  const { setQueryParams, getPaginationParams, clearQueryParams } = useQueryParams(onChangeParams);

  useEffect(() => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
  }, [getPaginationParams]);

  const fullSubjectModel = useSequenceRunListModel({
    params: { query: { page: page, rowsPerPage: rowsPerPage, ...dataQueryParams } },
  });

  const data = fullSubjectModel.data;
  if (!data) {
    throw new Error('No Data');
  }

  const tableData = data.results;

  return (
    <Table
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex flex-1 items-center pt-2'>
            <div className='w-full max-w-lg md:max-w-xs'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (searchBox.startsWith('S')) {
                        setDataQueryParams({ internal_id: searchBox });
                      } else {
                        setDataQueryParams({ library_internal_id: searchBox });
                      }
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
                  placeholder='Search (SubjectId or LibraryId)'
                  type='search'
                />
              </div>
            </div>
            <button
              onClick={() => {
                clearQueryParams();
                setSearchBox('');
              }}
              className='ml-2 text-sm text-gray-400 hover:text-gray-600'
            >
              reset
            </button>
          </div>
        </div>
      }
      columns={[...sequenceRunColumn]}
      tableData={tableData}
      paginationProps={{
        totalCount: data.pagination.count ?? 0,
        rowsPerPage: data.pagination.rowsPerPage ?? 0,
        currentPage: data.pagination.page ?? 0,
        setPage: (n: number) => {
          setQueryParams({ page: n });
        },
        setRowsPerPage: (n: number) => {
          setQueryParams({ rowsPerPage: n });
        },
        countUnit: 'runs',
      }}
    />
  );
};

const sequenceRunColumn: Column[] = [
  {
    header: 'Instrument Run Id',
    accessor: 'instrumentRunId',
    cell: (instrumentRunId: unknown) => {
      if (!instrumentRunId) {
        return <div>-</div>;
      } else {
        return (
          <Link
            to={`detail/${instrumentRunId}`}
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
          >
            {instrumentRunId as string}
          </Link>
        );
      }
    },
  },
  {
    header: 'Start Time',
    accessor: 'startTime',
    cell: (startTime: unknown) => {
      if (!startTime) {
        return <div>-</div>;
      } else {
        return <div>{dayjs(startTime as string).format('YYYY-MM-DD')}</div>;
      }
    },
  },
  {
    header: 'End Time',
    accessor: 'endTime',
    cell: (endTime: unknown) => {
      if (!endTime) {
        return <div>-</div>;
      } else {
        return <div>{dayjs(endTime as string).format('YYYY-MM-DD')}</div>;
      }
    },
  },
  {
    header: 'Sequencing',
    accessor: 'status',
    cell: (status: unknown) => {
      return (
        <Badge status={(status as string) || 'UNKNOWN'}>{(status || 'UNKNOWN') as ReactNode}</Badge>
      );
    },
  },
  {
    header: 'Bcl Convert',
    accessor: 'bclConvertStatus',
    cell: (status: unknown) => {
      return (
        <Badge status={(status as string) || 'UNKNOWN'}>{(status || 'UNKNOWN') as ReactNode}</Badge>
      );
    },
  },
  {
    header: '',
    accessor: 'instrumentRunId',
    cell: (instrumentRunId: unknown) => {
      if (!instrumentRunId) {
        return <div>-</div>;
      } else {
        return (
          <div className='flex flex-row items-center'>
            <Link
              to={`sequence/${instrumentRunId}/details`}
              className={classNames(
                'flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
              )}
            >
              <TableCellsIcon className='h-5 w-5 pr-1 shrink-0 text-blue-500' aria-hidden='true' />
              Details
            </Link>
            {/* <Link
              to={`sequence/${instrumentRunId}/diagram`}
              className={classNames(
                'flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
              )}
            >
              <RectangleGroupIcon
                className='h-5 w-5 pr-1 shrink-0 text-blue-500'
                aria-hidden='true'
              />
              Diagram
            </Link> */}
            <Link
              to={`sequence/${instrumentRunId}/report`}
              className={classNames(
                'flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
              )}
            >
              <ClipboardIcon className='h-5 w-5 pr-1 shrink-0 text-blue-500' aria-hidden='true' />
              Report
            </Link>
          </div>
        );
      }
    },
  },
];

export default SequenceRunTable;
