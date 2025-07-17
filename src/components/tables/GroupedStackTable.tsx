import { FC, ReactNode, Fragment, useState } from 'react';
import { classNames } from '@/utils/commonUtils';
import Pagination, { PaginationProps } from './Pagination';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import { TableData } from './Table';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';

export type GroupedStackTableData = {
  groupTitle: Record<string, unknown>;
  groupData: Record<string, unknown>[];
};

export type GroupedStackTableColumn = {
  header: ReactNode;
  accessor: string;
  cell?: (data: unknown, rowData: TableData) => ReactNode;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc';
};

export interface GroupedTableProps {
  tableHeader?: ReactNode;
  tableDescription?: string;
  columns: GroupedStackTableColumn[];
  tableData: GroupedStackTableData[];
  inCard?: boolean;
  stickyHeader?: boolean;
  paginationProps?: PaginationProps;
  isFetchingData?: boolean;
  headerActions?: ReactNode;
  chevronPosition?: 'left' | 'right';
}

const GroupedStackTable: FC<GroupedTableProps> = ({
  tableHeader,
  tableDescription,
  columns,
  tableData,
  inCard = true,
  stickyHeader = false,
  paginationProps,
  isFetchingData,
  headerActions,
  chevronPosition = 'left',
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  const toggleGroup = (groupIndex: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupIndex)) {
      newExpanded.delete(groupIndex);
    } else {
      newExpanded.add(groupIndex);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div className='w-full'>
      {/* Header Section */}
      {tableHeader && (
        <div className='mb-6 sm:flex sm:items-center sm:justify-between'>
          <div className='sm:flex-auto'>
            {tableHeader && (
              <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                {tableHeader}
              </h1>
            )}
            {tableDescription && (
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{tableDescription}</p>
            )}
          </div>
          {headerActions && (
            <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>{headerActions}</div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className='flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div
              className={classNames(
                inCard
                  ? 'overflow-hidden shadow-lg ring-1 ring-black/5 sm:rounded-xl dark:shadow-gray-900/30 dark:ring-white/10'
                  : ''
              )}
            >
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                {/* Table Header */}
                <thead className='bg-gray-50 dark:bg-gray-800/80'>
                  <tr>
                    {columns &&
                      columns.map((column, index) => (
                        <th
                          key={index}
                          scope='col'
                          className={classNames(
                            'px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300',
                            index === 0 ? 'pl-6 sm:pl-8' : '',
                            index === columns.length - 1 ? 'pr-6 sm:pr-8' : '',
                            stickyHeader
                              ? 'sticky top-0 z-10 border-b border-gray-200 bg-gray-50/95 backdrop-blur-sm backdrop-filter dark:border-gray-700 dark:bg-gray-800/95'
                              : ''
                          )}
                        >
                          {column.header}
                        </th>
                      ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody
                  className={classNames(
                    'divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900',
                    inCard ? 'bg-white dark:bg-gray-900' : 'bg-transparent'
                  )}
                >
                  {/* Loading State */}
                  {tableData.length > 0 && isFetchingData && (
                    <tr>
                      <td colSpan={columns.length} className='px-6 py-8'>
                        <BackdropWithText text='Loading data...' isVisible={false} />
                      </td>
                    </tr>
                  )}

                  {/* Data Rows */}
                  {tableData.length > 0
                    ? tableData.map((data, groupIndex) => (
                        <Fragment key={groupIndex}>
                          <Disclosure defaultOpen={false}>
                            {/* Group Header Row */}
                            <tr
                              className={classNames(
                                'border-t border-gray-200 dark:border-gray-700',
                                'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700',
                                'font-semibold text-gray-900 dark:text-gray-100',
                                'cursor-pointer transition-colors duration-200',
                                'hover:to-gray-150 hover:from-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600'
                              )}
                            >
                              {columns &&
                                columns.map((column, colIndex) => {
                                  const open = expandedGroups.has(groupIndex);
                                  return (
                                    <td
                                      key={colIndex}
                                      className={classNames(
                                        'px-3 py-3 text-sm whitespace-nowrap',
                                        colIndex === 0
                                          ? 'flex flex-row items-center gap-3 pl-6 sm:pl-8'
                                          : '',
                                        colIndex === columns.length - 1
                                          ? 'flex flex-row items-center justify-between gap-3 sm:pr-8 sm:pl-8'
                                          : ''
                                      )}
                                    >
                                      {chevronPosition === 'left' && colIndex === 0 && (
                                        <DisclosureButton
                                          as='div'
                                          className='flex cursor-pointer items-center'
                                        >
                                          <Tooltip
                                            text={open ? 'Collapse' : 'Expand'}
                                            position='bottom'
                                            size='small'
                                            background='light'
                                          >
                                            <div
                                              className='flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:bg-gray-50 hover:ring-gray-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600 dark:hover:ring-gray-500'
                                              onClick={() => {
                                                toggleGroup(groupIndex);
                                              }}
                                            >
                                              <ChevronDownIcon
                                                className={classNames(
                                                  'h-4 w-4 text-gray-600 transition-transform group-data-open:rotate-180 dark:text-gray-300',
                                                  open ? 'rotate-180' : ''
                                                )}
                                              />
                                            </div>
                                          </Tooltip>
                                        </DisclosureButton>
                                      )}
                                      <div className='flex items-center gap-2'>
                                        {column.cell
                                          ? column.cell(
                                              data.groupTitle[column.accessor],
                                              data.groupTitle
                                            )
                                          : (data.groupTitle[column.accessor] as ReactNode)}
                                        {colIndex === 0 && (
                                          <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'>
                                            {data.groupData.length} items
                                          </span>
                                        )}
                                      </div>
                                      {chevronPosition === 'right' &&
                                        colIndex === columns.length - 1 && (
                                          <DisclosureButton
                                            as='div'
                                            className='flex cursor-pointer items-center'
                                          >
                                            <Tooltip
                                              text={open ? 'Collapse' : 'Expand'}
                                              position='bottom'
                                              size='small'
                                              background='light'
                                            >
                                              <div
                                                className='flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:bg-gray-50 hover:ring-gray-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600 dark:hover:ring-gray-500'
                                                onClick={() => {
                                                  toggleGroup(groupIndex);
                                                }}
                                              >
                                                <ChevronDownIcon
                                                  className={classNames(
                                                    'h-4 w-4 text-gray-600 transition-transform group-data-open:rotate-180 dark:text-gray-300',
                                                    open ? 'rotate-180' : ''
                                                  )}
                                                />
                                              </div>
                                            </Tooltip>
                                          </DisclosureButton>
                                        )}
                                    </td>
                                  );
                                })}
                            </tr>

                            {/* Group Data Rows */}
                            {data.groupData.map((rowData, rowIndex) => (
                              <DisclosurePanel
                                as='tr'
                                key={rowIndex}
                                className={classNames(
                                  'border-t border-gray-100 dark:border-gray-800',
                                  'bg-white dark:bg-gray-900',
                                  'transition-all duration-200',
                                  'hover:bg-gray-50 dark:hover:bg-gray-800/75',
                                  rowIndex === 0 &&
                                    'border-t-2 border-blue-200 dark:border-blue-800'
                                )}
                              >
                                {columns &&
                                  columns.map((column, colIndex) => (
                                    <td
                                      key={colIndex}
                                      className={classNames(
                                        'px-4 py-2 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300',
                                        colIndex === 0 ? 'pl-12 sm:pl-16' : '',
                                        colIndex === columns.length - 1 ? 'pr-6 sm:pr-8' : ''
                                      )}
                                    >
                                      {colIndex === 0 && (
                                        <div className='flex items-center gap-2'>
                                          <div className='flex h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600' />
                                          {column.cell
                                            ? column.cell(rowData[column.accessor], rowData)
                                            : (rowData[column.accessor] as ReactNode)}
                                        </div>
                                      )}
                                      {colIndex !== 0 &&
                                        (column.cell
                                          ? column.cell(rowData[column.accessor], rowData)
                                          : (rowData[column.accessor] as ReactNode))}
                                    </td>
                                  ))}
                              </DisclosurePanel>
                            ))}
                          </Disclosure>
                        </Fragment>
                      ))
                    : isFetchingData &&
                      [...Array(10)].map((_, index) => (
                        <tr key={index} className='border-t border-gray-100 dark:border-gray-800'>
                          {columns.map((_column, colIndex) => (
                            <td
                              key={colIndex}
                              className='px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100'
                            >
                              <Skeleton height={20} />
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

      {/* Empty State */}
      {tableData.length === 0 && !isFetchingData && (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='mx-auto h-12 w-12 text-gray-400'>
            <svg
              className='h-12 w-12'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
            No data found
          </h3>
        </div>
      )}

      {/* Pagination */}
      {paginationProps && !isFetchingData && <Pagination {...paginationProps} />}
    </div>
  );
};

export default GroupedStackTable;
