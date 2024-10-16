// import { useWorkflowRunListModel } from '@/api/workflow';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import generateFastqDataArray from '@/api/_mock/mockFastQData';

const SequenceRunsFastqTable = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const [searchBox, setSearchBox] = useState<string>('');
  const [dataQueryParams, setDataQueryParams] = useState<Record<string, string>>({});

  const onChangeParams = async () => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
  };
  const { setQueryParams, getPaginationParams, clearQueryParams } = useQueryParams(onChangeParams);

  useEffect(() => {
    if (getPaginationParams().page && getPaginationParams().rowsPerPage) {
      setPage(getPaginationParams().page);
      setRowsPerPage(getPaginationParams().rowsPerPage);
    }
  }, [getPaginationParams]);

  const data = generateFastqDataArray(20);
  if (!data) {
    throw new Error('No Data');
  }

  const tableData = data;

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
                  placeholder='Search (SubjectId, LibraryId or WorkflowrunId)'
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
      //   paginationProps={{
      //     totalCount: data.pagination.count ?? 0,
      //     rowsPerPage: data.pagination.rowsPerPage ?? 0,
      //     currentPage: data.pagination.page ?? 0,
      //     setPage: (n: number) => {
      //       setQueryParams({ page: n });
      //     },
      //     setRowsPerPage: (n: number) => {
      //       setQueryParams({ rowsPerPage: n });
      //     },
      //     countUnit: 'subjects',
      //   }}
    />
  );
};
const sequenceRunColumn: Column[] = [
  {
    header: 'Subject ID',
    accessor: 'SubjectID',
    cell: (value) => <Link to={`/runs/sequence/${value}`}>{`${value}`}</Link>,
  },
  {
    header: 'Library ID',
    accessor: 'LibraryID',
    cell: (value) => <Link to={`/runs/sequence/${value}`}>{`${value}`}</Link>,
  },
  {
    header: 'Sample ID',
    accessor: 'SampleID',
  },
  {
    header: 'Size (num)',
    accessor: 'size_num',
  },
  {
    header: 'Size (chr)',
    accessor: 'size_chr',
  },
  {
    header: 'Type',
    accessor: 'Type',
  },
  {
    header: 'Phenotype',
    accessor: 'Phenotype',
  },
  {
    header: 'Workflow',
    accessor: 'Workflow',
  },
  {
    header: 'Assay',
    accessor: 'Assay',
  },
  {
    header: 'Path',
    accessor: 'path',
  },
  {
    header: 'Topup',
    accessor: 'topup',
  },
  {
    header: 'RGID',
    accessor: 'rgid',
  },
  {
    header: 'Read',
    accessor: 'read',
  },
  {
    header: 'Lane',
    accessor: 'lane',
  },
  {
    header: 'Subject URL',
    accessor: 'sbj_url',
  },
];

export default SequenceRunsFastqTable;
