import { FC, ReactNode, useEffect, useState } from 'react';
import { classNames } from '@/utils/utils';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Pagination, { PaginationProps } from './Pagination';

type TableData = Record<string, unknown>;

export type Column = {
  header: ReactNode;
  accessor: string;
  cell?: (data: unknown) => ReactNode;
  sortable?: boolean;
};

interface TableProps {
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
  striped = true,
  inCard = true,
  stickyHeader = false,
}) => {
  const [sortedData, setSortedData] = useState(tableData);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const onSort = (key: string) => {
    const direction =
      sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    const sorted = [...tableData].sort((a, b) => {
      if (a[key] && b[key]) {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    setSortedData(tableData);
  }, [tableData]);

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
      <div className='mt-4 flow-root'>
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
                            index == 0 ? 'pl-4 sm:pl-6 lg:pl-8' : '',
                            index == columns.length - 1 ? 'pr-4 sm:pr-6 lg:pr-8' : '',
                            stickyHeader
                              ? 'sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75'
                              : ''
                          )}
                          onClick={() => column.sortable && onSort(column.accessor)}
                        >
                          <div
                            className={classNames(
                              column.sortable ? 'group inline-flex cursor-pointer' : ''
                            )}
                          >
                            {column.header}
                            {column.sortable && (
                              <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                                <ChevronDownIcon
                                  aria-hidden='true'
                                  className={classNames(
                                    'h-5 w-5 transition-transform duration-300',
                                    sortConfig &&
                                      sortConfig.key === column.accessor &&
                                      sortConfig.direction === 'descending'
                                      ? '-rotate-180'
                                      : 'rotate-0'
                                  )}
                                />
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {sortedData.map((data, index) => (
                    <tr key={index} className={classNames(striped ? 'even:bg-gray-50' : '')}>
                      {columns &&
                        columns.map((column, index) => (
                          <td
                            key={column.accessor}
                            className={classNames(
                              'whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900',
                              index == 0 ? 'pl-4 sm:pl-6' : '',
                              index == columns.length - 1 ? 'pr-4 sm:pr-6' : ''
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
