import { useState, useMemo, Fragment, FC } from 'react';
import { classNames } from '@/utils/commonUtils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
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
    <div className={`overflow-x-auto ${className}`}>
      <div className='p-6'>
        {/* Table header with pagination controls */}
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-sm font-medium text-gray-700'>
            {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
          </h2>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>Show</span>
            <div className='relative'>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className='appearance-none rounded-md border border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className='pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
            </div>
          </div>
        </div>

        {/* Wrap table in scrollable container */}
        <div className='overflow-x-auto rounded-lg border border-gray-200'>
          <table className='w-full table-fixed divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className='min-w-[200px] truncate px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className='hover:bg-gray-50'>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className='truncate px-4 py-4 text-sm text-gray-900'
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
                  'rounded px-2 py-1 text-xs',
                  currentPage === 1
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                First
              </button>

              {paginationNumbers.map((pageNum, idx) => (
                <Fragment key={idx}>
                  {pageNum === '...' ? (
                    <span className='px-2 py-1 text-gray-500'>...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum as number)}
                      className={classNames(
                        'rounded px-3 py-1 text-sm',
                        currentPage === pageNum
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
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
                  'rounded px-2 py-1 text-xs',
                  currentPage === totalPages
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                Last
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListTable;
