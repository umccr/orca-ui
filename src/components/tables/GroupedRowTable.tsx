import { FC, ReactNode, Fragment } from 'react';
import { classNames } from '@/utils/commonUtils';

export type TableData = {
  groupTitle: string;
  groupData: Record<string, unknown>[];
};

export type Column = {
  header: ReactNode;
  accessor: string;
  cell?: (data: unknown) => ReactNode;
};

export interface GroupedTableProps {
  tableHeader?: ReactNode;
  tableDescription?: string;
  columns: Column[];
  tableData: TableData[];
  striped?: boolean;
  inCard?: boolean;
  stickyHeader?: boolean;
}

const GroupedTable: FC<GroupedTableProps> = ({
  tableHeader,
  tableDescription,
  columns,
  tableData,
  striped = true,
  inCard = true,
  stickyHeader = false,
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
                <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
                  {tableData.map((data, index) => (
                    <Fragment key={index}>
                      <tr className='border-t border-gray-200 dark:border-gray-700'>
                        <th
                          scope='colgroup'
                          colSpan={columns.length}
                          className='bg-gray-50 py-2 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:bg-gray-800 dark:text-gray-200'
                        >
                          {data.groupTitle}
                        </th>
                      </tr>
                      {data.groupData.map((data, index) => (
                        <tr
                          key={index}
                          className={classNames(
                            striped ? 'even:bg-gray-50 dark:even:bg-gray-800/50' : '',
                            index === 0
                              ? 'border-gray-300 dark:border-gray-700'
                              : 'border-gray-200 dark:border-gray-700',
                            'border-t transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/75'
                          )}
                        >
                          {columns &&
                            columns.map((column, index) => (
                              <td
                                key={index}
                                className={classNames(
                                  'px-3 py-2 text-sm whitespace-nowrap text-gray-900 dark:text-gray-200',
                                  index === 0 ? 'pl-4 sm:pl-6' : '',
                                  index === columns.length - 1 ? 'pr-4 sm:pr-6' : ''
                                )}
                              >
                                {column.cell
                                  ? column.cell(data[column.accessor])
                                  : (data[column.accessor] as ReactNode)}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupedTable;
