import { useWorkflowRunListModel } from '@/api/workflow';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import dayjs from '@/utils/dayjs';
import { TableCellsIcon } from '@heroicons/react/24/outline';
import { StatusBadge } from '@/components/common/statusBadge';

const WorkflowRunsTable = () => {
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

  const WorkflowRunsModel = useWorkflowRunListModel({
    // params: { query: { page: page, rowsPerPage: rowsPerPage, ...dataQueryParams } },
    // bugs on rows per page of workflow run call
    params: { query: { page: page, ...dataQueryParams } },
  });

  const data = WorkflowRunsModel.data;
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
        countUnit: 'subjects',
      }}
    />
  );
};

const sequenceRunColumn: Column[] = [
  {
    header: 'Workflow Run Name',
    accessor: 'workflowRunName',
    cell: (workflowRunName: unknown) => {
      if (!workflowRunName) {
        return <div>-</div>;
      } else {
        return (
          <Link
            to={`workflow/${workflowRunName}/details`}
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
          >
            {workflowRunName as string}
          </Link>
        );
      }
    },
  },
  {
    header: 'Portal Run Id',
    accessor: 'portalRunId',
    cell: (portalRunId: unknown) => {
      if (!portalRunId) {
        return <div>-</div>;
      } else {
        return <div>{portalRunId as string}</div>;
      }
    },
  },
  {
    header: 'Time Stamp',
    accessor: 'timestamp',
    cell: (endTime: unknown) => {
      if (!endTime) {
        return <div>-</div>;
      } else {
        return <div>{dayjs(endTime as string).format('llll')}</div>;
      }
    },
  },
  {
    header: 'Status',
    accessor: 'status',
    cell: (status: unknown) => {
      return <StatusBadge status={(status as string) || 'unkmown'}></StatusBadge>;
    },
  },
  {
    header: '',
    accessor: 'portalRunId',
    cell: (portalRunId: unknown) => {
      if (!portalRunId) {
        return <div>-</div>;
      } else {
        return (
          <div className='flex flex-row items-center'>
            <Link
              to={`sequence/${portalRunId}/details`}
              className={classNames(
                'flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
              )}
            >
              <TableCellsIcon className='h-5 w-5 pr-1 shrink-0 text-blue-500' aria-hidden='true' />
              Details
            </Link>
          </div>
        );
      }
    },
  },
];

export default WorkflowRunsTable;
