import { useState, useMemo, Fragment, FC } from 'react';
import { classNames } from '@/utils/commonUtils';
import { DEFAULT_ITEMS_PER_PAGE_OPTIONS } from '@/utils/constant';

interface ListTableProps {
  data: Record<string, number | string>[];
  className?: string;
  itemsPerPageOptions?: number[];
}

const ListTable: FC<ListTableProps> = ({
  data,
  className,
  itemsPerPageOptions = DEFAULT_ITEMS_PER_PAGE_OPTIONS,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const columns = useMemo(() => {
    return Object.keys(data[0]);
  }, [data]);

  // Pagination logic
  const totalItems = data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page is valid
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (safeCurrentPage !== currentPage) {
    setCurrentPage(safeCurrentPage);
  }

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedData = data?.slice(startIndex, startIndex + itemsPerPage) || [];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };
  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    // Adjust current page to keep the first visible item still visible
    const firstVisibleItemIndex = (currentPage - 1) * itemsPerPage;
    const newPage = Math.floor(firstVisibleItemIndex / newItemsPerPage) + 1;
    setCurrentPage(Math.min(newPage, Math.ceil(totalItems / newItemsPerPage)));
  };

  // Generate pagination numbers
  const paginationNumbers = useMemo(() => {
    if (totalPages <= 9) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 5) {
      return [1, 2, 3, 4, 5, 6, 7, '...', totalPages];
    }

    if (currentPage >= totalPages - 4) {
      return [
        1,
        '...',
        totalPages - 6,
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      '...',
      totalPages,
    ];
  }, [currentPage, totalPages]);

  if (!data || data.length === 0) {
    return <div className='py-4 text-center text-gray-500'>No data available</div>;
  }

  return (
    <div className={classNames('flex flex-col p-4', className)}>
      {/* Table header with pagination controls */}
      <div className='mb-4 flex items-center justify-between px-6'>
        <h2 className='text-sm font-medium text-gray-700 dark:text-gray-200'>
          {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
        </h2>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>Show</span>
          <div className='relative'>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className='appearance-none rounded-md border border-gray-300 bg-white py-1 pr-8 pl-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
        <table className='w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-800'>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className='min-w-[200px] truncate px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400'
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className='min-w-[200px] truncate px-4 py-4 text-sm text-gray-900 dark:text-gray-100'
                    title={row[column]?.toString()}
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='mt-4 flex justify-center'>
          <nav className='flex items-center space-x-1'>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={classNames(
                'rounded-sm px-2 py-1 text-xs',
                currentPage === 1
                  ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              First
            </button>

            {paginationNumbers.map((pageNum, idx) => (
              <Fragment key={idx}>
                {pageNum === '...' ? (
                  <span className='px-2 py-1 text-gray-500 dark:text-gray-400'>...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(pageNum as number)}
                    className={classNames(
                      'rounded-sm px-3 py-1 text-sm',
                      currentPage === pageNum
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                  >
                    {pageNum}
                  </button>
                )}
              </Fragment>
            ))}

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={classNames(
                'rounded-sm px-2 py-1 text-xs',
                currentPage === totalPages
                  ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              Last
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ListTable;
