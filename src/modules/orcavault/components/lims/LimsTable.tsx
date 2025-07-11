import { Table } from '@/components/tables';
import { useQueryParams } from '@/hooks/useQueryParams';
import { SpinnerWithText } from '@/components/common/spinner';
import { useAllLims } from '../../api/mart/lims';
import { LimFilter, LimsOrderBy } from '../../api/graphql/codegen/graphql';
import { FIELD_LABEL } from '../../api/graphql/queries/allLims';
import { getMartSortDirection, getMartSortValue } from '../utils';
import { PopoverDropdown } from '@/components/common/dropdowns';
import Button from '@/components/common/buttons/Button';
import { classNames } from '@/utils/commonUtils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Checkbox } from '@/components/common/checkbox';
// import Papa from 'papaparse';

export const LimsTable = () => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();
  const queryParams = getQueryParams();

  const currentQueryFilter = queryParams.filter;
  const filter = currentQueryFilter ? (JSON.parse(currentQueryFilter) as LimFilter) : undefined;

  const currentSort = queryParams?.ordering;
  const currentSortType = currentSort as LimsOrderBy;

  const pagination = getPaginationParams();
  const offset = (pagination.page - 1) * pagination.rowsPerPage;

  const libraryModel = useAllLims({
    filter: filter,
    first: pagination.rowsPerPage,
    offset: offset,
    orderBy: currentSort ? currentSortType : LimsOrderBy.SequencingRunDateDesc,
  });

  const [displayedColumns, setDisplayedColumns] = useState<Record<string, boolean>>(
    FIELD_LABEL.reduce(
      (acc, field) => ({
        ...acc,
        [field.key]: true,
      }),
      {}
    )
  );

  if (libraryModel.isLoading) {
    return (
      <div>
        <SpinnerWithText text='fetching LIMS records' />
      </div>
    );
  }

  const data = libraryModel.data?.allLims;
  if (!data) {
    throw new Error('Error: unable to retrieve results!');
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-end gap-2'>
        {/* <Button
          type='gray'
          size='sm'
          onClick={handleExportCSV}
          className={classNames(
            'flex items-center gap-2 px-3 py-2',
            'border border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800',
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-50 dark:hover:bg-gray-700',
            'focus:ring-2 focus:ring-blue-500 focus:outline-none',
            'transition-colors duration-200',
            'rounded-md'
          )}
        >
          Export CSV
          <ArrowTopRightOnSquareIcon className='h-5 w-5' />
        </Button> */}
        <PopoverDropdown
          btnChildren={
            <Button
              type='gray'
              size='sm'
              className={classNames(
                'flex items-center gap-2 px-3 py-2',
                'border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'focus:ring-2 focus:ring-blue-500 focus:outline-none',
                'transition-colors duration-200',
                'rounded-md'
              )}
            >
              Columns
              <ChevronDownIcon className='h-4 w-4' />
            </Button>
          }
          content={
            <div className='w-72 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'>
              <div className='p-4'>
                <h3 className='mb-3 text-sm font-medium text-gray-900 dark:text-gray-100'>
                  Show Columns
                </h3>
                <div className='max-h-64 space-y-2 overflow-y-auto'>
                  {FIELD_LABEL.map((field) => (
                    <div
                      key={field.key}
                      className={classNames(
                        'flex items-center rounded-md px-2 py-1.5',
                        'hover:bg-gray-50 dark:hover:bg-gray-700',
                        'transition-colors duration-150'
                      )}
                    >
                      <Checkbox
                        checked={displayedColumns[field.key]}
                        onChange={() =>
                          setDisplayedColumns((prev) => ({
                            ...prev,
                            [field.key]: !prev[field.key],
                          }))
                        }
                        label={field.label}
                        size='sm'
                        className='text-sm'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </div>
      <Table
        inCard={false}
        columns={FIELD_LABEL.filter((field) => displayedColumns[field.key]).map((field) => ({
          header: field.label,
          accessor: field.key,
          onSort: () => {
            setQueryParams({ ordering: getMartSortValue(currentSort, field.sortKeyPrefix) });
          },
          sortDirection: getMartSortDirection({ currentSort, key: field.sortKeyPrefix }),
        }))}
        tableData={data.nodes}
        paginationProps={{
          totalCount: data.totalCount,
          rowsPerPage: pagination.rowsPerPage ?? 0,
          currentPage: pagination.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
        }}
      />
    </>
  );
};
