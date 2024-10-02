import { FC, Fragment, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Pagination, { PaginationProps } from './Pagination';

export type TableData = Record<string, unknown>;

export type Column = {
  header: string;
  headerClassName?: string;
  headerGroup?: { label?: string; colSpan: number; additionalClassName?: string };
  accessor: string;
  cell?: (data: unknown) => ReactNode;
  cellClassName?: string;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc';
};

export interface TableProps {
  tableHeader?: ReactNode | string;
  tableDescription?: string;
  columns: Column[];
  tableData: TableData[];
  striped?: boolean;
  inCard?: boolean;
  stickyHeader?: boolean;
  paginationProps?: PaginationProps;
}

const Table: FC<TableProps> = ({
  tableHeader,
  tableDescription,
  columns,
  tableData,
  paginationProps,
  striped = false,
  inCard = true,
  stickyHeader = false,
}) => {
  return (
    <div className=''>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          {tableHeader && (
            <h1 className='text-base font-semibold leading-6 text-gray-900'>{tableHeader}</h1>
          )}
          {tableDescription && <p className='mt-2 text-sm text-gray-700'>{tableDescription}</p>}
        </div>
      </div>

      <div className='mt-2 flow-root'>
        <div className='overflow-x-auto '>
          <div className='inline-block min-w-full align-middle'>
            <div
              className={classNames(
                inCard ? 'overflow-hidden border-2 border-black border-opacity-5 sm:rounded-lg' : ''
              )}
            >
              <table className='min-w-full divide-y divide-gray-300'>
                {/* Experiment additional <thead /> to group column description */}
                <thead>
                  {columns.find((c) => !!c.headerGroup) && (
                    <tr>
                      {columns.map((columnProp, index) => {
                        const group = columnProp.headerGroup;
                        if (!group) {
                          return <Fragment key={`subheader-${index}`} />;
                        }

                        return (
                          <th
                            key={`subheader-${index}`}
                            colSpan={group.colSpan}
                            className={classNames(
                              'px-3 py-3.5 text-center text-sm font-semibold rounded-t-lg',
                              group.additionalClassName ? group.additionalClassName : ''
                            )}
                          >
                            {group.label}
                          </th>
                        );
                      })}
                    </tr>
                  )}
                </thead>
                <thead className={classNames('bg-gray-50')}>
                  <tr>
                    {columns &&
                      columns.map((column, index) => (
                        <th
                          key={`idx-${index}-${column.accessor}`}
                          scope='col'
                          className={classNames(
                            'px-3 py-3.5 text-left text-sm font-semibold text-gray-900',
                            index == 0 ? 'pl-4 sm:pl-6 lg:pl-8' : '',
                            index == columns.length - 1 ? 'pr-4 sm:pr-6 lg:pr-8' : '',
                            stickyHeader
                              ? 'sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75'
                              : '',
                            column.headerClassName ? column.headerClassName : ''
                          )}
                          onClick={() => column.onSort && column.onSort()}
                        >
                          <div
                            className={classNames(
                              column.onSort ? 'group inline-flex cursor-pointer' : ''
                            )}
                          >
                            {column.header}
                            {column.sortDirection && (
                              <span className='visible ml-2 flex-none rounded text-gray-400'>
                                <ChevronDownIcon
                                  aria-hidden='true'
                                  className={classNames(
                                    'h-5 w-5 transition-transform duration-300',
                                    column.sortDirection === 'asc' ? '-rotate-180' : 'rotate-0'
                                  )}
                                />
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody
                  className={classNames(
                    'divide-y divide-gray-200 last:divide-gray-300',
                    inCard ? 'bg-white' : ' bg-transparent'
                  )}
                >
                  {tableData.map((data, index) => (
                    <tr
                      key={index}
                      className={classNames(
                        striped ? 'even:bg-gray-50' : '',
                        inCard ? 'hover:bg-gray-50' : ' hover:bg-gray-100'
                      )}
                    >
                      {columns &&
                        columns.map((column, index) => (
                          <td
                            key={index}
                            className={classNames(
                              'whitespace-nowrap py-2 px-3 text-sm font-medium text-gray-900',
                              index == 0 ? 'pl-4 sm:pl-6' : '',
                              index == columns.length - 1 ? 'pr-4 sm:pr-6' : '',
                              column.cellClassName ? column.cellClassName : ''
                            )}
                          >
                            {column.cell
                              ? column.cell(data[column.accessor])
                              : (data[column.accessor] as ReactNode)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {paginationProps && <Pagination {...paginationProps} />}
    </div>
  );
};

export default Table;

/**
 * Helper function to sort array of json objects
 */
export const handleSort = ({
  data,
  sortColumn,
  sortDirection,
}: {
  data: Record<string, string>[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}): Record<string, string>[] => {
  const sorted = [...data].sort((a, b) => {
    if (a[sortColumn] && b[sortColumn]) {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  return sorted;
};

export const getCurrentSortDirection = (currentSort: string | undefined, key: string) => {
  if (!currentSort || !currentSort.endsWith(key)) {
    return undefined;
  }

  if (currentSort?.startsWith('-')) {
    return 'desc';
  }

  return 'asc';
};

export const getSortValue = (currentSort: string | undefined, key: string) => {
  const currentSortDirection = getCurrentSortDirection(currentSort, key);

  // Going the opposite here from the current sort direction
  return `${currentSortDirection === 'desc' ? '' : '-'}${key}`;
};

export const multiRowCel = (p: unknown) => {
  const data = p as string[];
  return (
    <>
      {data.map((item, idx) => (
        <div className='py-2' key={idx}>
          {item}
        </div>
      ))}
    </>
  );
};
