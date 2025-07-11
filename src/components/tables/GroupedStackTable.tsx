import { FC, ReactNode, Fragment } from 'react';
import { classNames } from '@/utils/commonUtils';
import Pagination, { PaginationProps } from './Pagination';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import { TableData } from './Table';

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
}) => {
  return (
    <div className='w-full'>
      <div className='mb-6 sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          {tableHeader && (
            <h1 className='text-lg leading-6 font-semibold text-gray-900 dark:text-gray-100'>
              {tableHeader}
            </h1>
          )}
          {tableDescription && (
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{tableDescription}</p>
          )}
        </div>
      </div>
      <div className='flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div
              className={classNames(
                inCard
                  ? 'overflow-hidden shadow-md ring-1 ring-black/5 sm:rounded-lg dark:ring-white/10'
                  : ''
              )}
            >
              <table className='min-w-full divide-y divide-gray-300 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-800'>
                  <tr>
                    {columns &&
                      columns.map((column, index) => (
                        <th
                          key={index}
                          scope='col'
                          className={classNames(
                            'px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-200',
                            index === 0 ? 'pl-4 sm:pl-6 lg:pl-8' : '',
                            index === columns.length - 1 ? 'pr-4 sm:pr-6 lg:pr-8' : '',
                            stickyHeader
                              ? 'bg-opacity-75 sticky top-0 z-10 border-b border-gray-300 bg-gray-50 backdrop-blur-sm backdrop-filter dark:border-gray-700 dark:bg-gray-800'
                              : ''
                          )}
                        >
                          {column.header}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody
                  className={classNames(
                    'divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900',
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
                        <Fragment key={index}>
                          <Disclosure defaultOpen={false}>
                            <DisclosureButton
                              as='tr'
                              key={index}
                              className={classNames(
                                'border-t border-gray-300 dark:border-gray-700',
                                'bg-gray-100 dark:bg-gray-800',
                                'font-medium text-gray-900 dark:text-gray-100',
                                'cursor-pointer'
                              )}
                            >
                              {columns &&
                                columns.map((column, index) => (
                                  <td
                                    key={index}
                                    className={classNames(
                                      'px-3 py-3 text-sm whitespace-nowrap',
                                      index === 0 ? 'pl-4 sm:pl-6' : '',
                                      index === columns.length - 1 ? 'pr-4 sm:pr-6' : ''
                                    )}
                                  >
                                    {column.cell
                                      ? column.cell(
                                          data.groupTitle[column.accessor],
                                          data.groupTitle
                                        )
                                      : (data.groupTitle[column.accessor] as ReactNode)}
                                  </td>
                                ))}
                            </DisclosureButton>

                            {data.groupData.map((data, index) => (
                              <DisclosurePanel
                                as='tr'
                                key={index}
                                className={classNames(
                                  'even:bg-gray-50 dark:even:bg-gray-800/50',
                                  'border-t border-gray-200 dark:border-gray-700',
                                  'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/75'
                                )}
                              >
                                {columns &&
                                  columns.map((column, index) => (
                                    <td
                                      key={index}
                                      className={classNames(
                                        'px-3 py-2 text-sm whitespace-nowrap text-gray-900 dark:text-gray-200',
                                        index === 0 ? 'pl-12 sm:pl-12' : '',
                                        index === columns.length - 1 ? 'pr-4 sm:pr-6' : ''
                                      )}
                                    >
                                      {column.cell
                                        ? column.cell(data[column.accessor], data)
                                        : (data[column.accessor] as ReactNode)}
                                    </td>
                                  ))}
                              </DisclosurePanel>
                            ))}
                          </Disclosure>
                        </Fragment>
                      ))
                    : isFetchingData &&
                      [...Array(10)].map((_, index) => (
                        <tr key={index}>
                          {columns.map((_column, index) => (
                            <td
                              key={index}
                              className='px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-900'
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

export default GroupedStackTable;
