import { FC, ReactNode, Fragment } from 'react';
import { classNames } from '@/utils/commonUtils';

export type TableData = {
  groupTitle: string;
  groupData: Record<string, string | number>[];
};

export type Column = {
  header: string;
  accessor: string;
  cell?: (data: string | number) => ReactNode;
};

export interface GroupedTableProps {
  tableHeader?: string;
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
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          {tableHeader && (
            <h1 className='text-base font-semibold leading-6 text-gray-900'>{tableHeader}</h1>
          )}
          {tableDescription && <p className='mt-2 text-sm text-gray-700'>{tableDescription}</p>}
        </div>
      </div>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div
              className={classNames(
                inCard
                  ? 'overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'
                  : ''
              )}
            >
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    {columns &&
                      columns.map((column, index) => (
                        <th
                          key={column.accessor}
                          scope='col'
                          className={classNames(
                            'px-3 py-3.5 text-left text-sm font-semibold text-gray-900',
                            index === 0 ? 'pl-4 sm:pl-6 lg:pl-8' : '',
                            index === columns.length - 1 ? 'pr-4 sm:pr-6 lg:pr-8' : '',
                            stickyHeader
                              ? 'sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75'
                              : ''
                          )}
                        >
                          {column.header}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {tableData.map((data, index) => (
                    <Fragment key={index}>
                      <tr className='border-t border-gray-200'>
                        <th
                          scope='colgroup'
                          colSpan={columns.length}
                          className='bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                        >
                          {data.groupTitle}
                        </th>
                      </tr>
                      {data.groupData.map((data, index) => (
                        <tr
                          key={index}
                          className={classNames(
                            striped ? 'even:bg-gray-50' : '',
                            index === 0 ? 'border-gray-300' : 'border-gray-200',
                            'border-t'
                          )}
                        >
                          {columns &&
                            columns.map((column, index) => (
                              <td
                                key={column.accessor}
                                className={classNames(
                                  'whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900',
                                  index === 0 ? 'pl-4 sm:pl-6' : '',
                                  index === columns.length - 1 ? 'pr-4 sm:pr-6' : ''
                                )}
                              >
                                {column.cell
                                  ? column.cell(data[column.accessor])
                                  : data[column.accessor]}
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
