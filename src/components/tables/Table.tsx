/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { FC, Fragment, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
import { ChevronDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Pagination, { PaginationProps } from './Pagination';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import toaster from '@/components/common/toaster';
import { Tooltip } from '@/components/common/tooltips';
export type TableData = Record<string, unknown>;

export type Column = {
  header: ReactNode;
  headerClassName?: string;
  headerGroup?: { label?: string; colSpan: number; additionalClassName?: string };
  accessor: string;
  cellClassName?: string;
  cell?: (cellData: unknown, rowData: TableData) => ReactNode;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc';
  copyable?: boolean;
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
  isFetchingData?: boolean;
  headerActions?: ReactNode;
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
  isFetchingData = false,
  headerActions,
}) => {
  return (
    <div>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          {tableHeader && (
            <h1 className='text-base font-semibold leading-7 text-gray-900 dark:text-gray-100'>
              {tableHeader}
            </h1>
          )}
          {tableDescription && (
            <p className='mt-2 text-sm text-gray-700 dark:text-gray-300'>{tableDescription}</p>
          )}
        </div>
        {headerActions && <div className='mt-4 sm:mt-0'>{headerActions}</div>}
      </div>

      <div className='flow-root pt-2'>
        <div className={classNames(tableData.length > 0 ? 'overflow-x-auto' : '')}>
          <div className='inline-block min-w-full align-middle'>
            <div
              className={classNames(
                inCard
                  ? 'overflow-hidden border-2 border-gray-500 border-opacity-5 sm:rounded-lg'
                  : ''
              )}
            >
              <table className='min-w-full'>
                {/* Experiment additional <thead /> to group column w/ description */}
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
                              'rounded-t-lg px-3 py-3.5 text-center text-sm font-semibold',
                              'dark:bg-gray-800/50 dark:text-gray-200',
                              'border-b border-gray-200 dark:border-gray-700',
                              group.additionalClassName
                            )}
                          >
                            {group.label}
                          </th>
                        );
                      })}
                    </tr>
                  )}
                </thead>
                <thead className={classNames('bg-gray-100')}>
                  <tr>
                    {columns &&
                      columns.map((column, index) => (
                        <th
                          key={`idx-${index}-${column.accessor}`}
                          scope='col'
                          className={classNames(
                            'px-3 py-3 text-left text-sm font-semibold',
                            'text-gray-900 dark:bg-gray-800/50 dark:text-gray-200',
                            'divide-y divide-gray-200 dark:divide-gray-700',
                            'transition-colors duration-200',
                            column.onSort &&
                              '!cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50',
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
                            className={classNames(column.onSort ? 'group inline-flex gap-2' : '')}
                          >
                            {column.header}
                            {column.sortDirection && (
                              <span className='visible ml-2 flex-none rounded text-gray-400'>
                                <ChevronDownIcon
                                  className={classNames(
                                    'h-5 w-5 cursor-pointer stroke-gray-500 opacity-100 transition-opacity duration-200',
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
                    'relative divide-y divide-gray-200 last:divide-gray-300 dark:divide-gray-700',
                    inCard ? 'bg-white dark:bg-gray-900' : 'bg-transparent'
                  )}
                >
                  {tableData.length > 0 && isFetchingData && (
                    <tr>
                      <td>
                        <BackdropWithText text='Loading data...' isVisible={true} />
                      </td>
                    </tr>
                  )}
                  {tableData.length > 0
                    ? tableData.map((data, index) => (
                        <tr
                          key={index}
                          className={classNames(
                            'transition-colors duration-200',
                            striped ? 'even:bg-gray-50 dark:even:bg-gray-800/50' : '',
                            inCard
                              ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          {columns &&
                            columns.map((column, index) => (
                              <td
                                key={index}
                                className={classNames(
                                  'whitespace-nowrap px-3 py-2 text-sm',
                                  'text-gray-900 dark:text-gray-400',
                                  index == 0 ? 'pl-4 sm:pl-6' : '',
                                  index == columns.length - 1 ? 'pr-4 sm:pr-6' : '',
                                  column.cellClassName ? column.cellClassName : ''
                                )}
                              >
                                {/* only when hover, show the copy icon*/}
                                <div
                                  className={classNames(
                                    column.copyable ? 'group inline-flex gap-2' : ''
                                  )}
                                >
                                  {column.cell
                                    ? column.cell(data[column.accessor], data) // pass cell data and row data to cell renderer
                                    : (data[column.accessor] as ReactNode)}
                                  {column.copyable && (
                                    <Tooltip text='Copy' size='small' background='light'>
                                      <ClipboardDocumentIcon
                                        className={classNames(
                                          'h-5 w-5 !cursor-pointer',
                                          'stroke-gray-600 dark:stroke-gray-400',
                                          'opacity-0 group-hover:opacity-100',
                                          'transition-all duration-200',
                                          'hover:stroke-gray-700 dark:hover:stroke-gray-400'
                                        )}
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            data[column.accessor] as string
                                          );
                                          toaster.success({
                                            title: `Copied ${column.accessor} to clipboard`,
                                          });
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </div>
                              </td>
                            ))}
                        </tr>
                      ))
                    : isFetchingData &&
                      [...Array(10)].map((_, index) => (
                        <tr key={index}>
                          {columns.map((_column, index) => (
                            <td
                              key={index}
                              className='whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-900'
                            >
                              <Skeleton />
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
      {tableData.length == 0 && !isFetchingData && (
        <div className='flex justify-center'>No data found</div>
      )}

      {paginationProps && !isFetchingData && <Pagination {...paginationProps} />}
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

export const multiRowCell = (p: unknown) => {
  const data = p as string[] | string;
  return (
    <>
      {Array.isArray(data) ? (
        data.map((item, idx) => (
          <div className='py-2' key={idx}>
            {item}
          </div>
        ))
      ) : (
        <div className='py-2'>{data}</div>
      )}
    </>
  );
};
