import { ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
import { Button } from '@/components/common/buttons';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '@/utils/constant';

export type PaginationProps = {
  totalCount: number;
  rowsPerPage: number;
  currentPage: number;
  setPage: (newPage: number) => void;
  setRowsPerPage: (newRowsPerPage: number) => void;
  countUnit?: string;
  pageSizeOptions?: number[];
};

const PaginationDirectionButton = ({
  disabled,
  onClick,
  children,
  className,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Button
      size='sm'
      type='gray'
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        disabled ? 'bg-gray-50' : 'hover:bg-gray-100',
        'relative inline-flex h-7 items-center rounded-full !p-0 text-gray-400 focus:z-20 focus:outline-offset-0',
        className ?? ''
      )}
    >
      {children}
    </Button>
  );
};

export default function Pagination({
  totalCount,
  rowsPerPage,
  countUnit = 'records',
  setPage,
  setRowsPerPage,
  currentPage,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: PaginationProps) {
  const [inputPageNumber, setInputPageNumber] = useState(currentPage);
  const [rowsPerPageNumber, setRowsPerPageNumber] = useState(rowsPerPage);

  useEffect(() => {
    setInputPageNumber(currentPage);
    setRowsPerPageNumber(rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const maxPage = Math.ceil(totalCount / rowsPerPage);
  const from = Math.min((currentPage - 1) * rowsPerPage + 1, totalCount);
  const to = Math.min((currentPage - 1) * rowsPerPage + rowsPerPage, totalCount);

  return (
    <div className='flex items-center justify-between border-t py-4 dark:border-gray-700'>
      {/* mobile pagination */}
      <div className='flex flex-1 justify-between md:hidden'>
        <Button
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
          className={classNames(
            'relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium',
            'border dark:border-gray-600',
            'bg-white dark:bg-gray-800',
            'text-gray-700 dark:text-gray-200',
            currentPage === 1
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          )}
        >
          Previous
        </Button>
        <Button
          disabled={currentPage >= maxPage}
          onClick={() => setPage(currentPage + 1)}
          className={classNames(
            'relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium',
            'border dark:border-gray-600',
            'bg-white dark:bg-gray-800',
            'text-gray-700 dark:text-gray-200',
            currentPage >= maxPage
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          )}
        >
          Next
        </Button>
      </div>

      {/* Pagination */}
      <div className='hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4'>
        <div className='flex flex-row'>
          <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            <span className='font-medium'>{from}</span>
            {' - '}
            <span className='font-medium'>{to}</span>
            {' of '}
            <span className='font-medium'>{totalCount}</span> {countUnit}
          </p>
        </div>

        {/* Rows per page: */}
        <div className='flex flex-row items-center'>
          <label
            htmlFor='rows-per-page'
            className='whitespace-nowrap px-2 text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Rows per page:
          </label>
          <select
            id='rows-per-page'
            name='rows-per-page'
            className='block h-8 w-16 rounded-md border-2 border-gray-500/5 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400'
            value={rowsPerPageNumber}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <nav
            aria-label='Pagination'
            className='isolate inline-flex items-center gap-2 rounded-md'
          >
            <PaginationDirectionButton disabled={currentPage === 1} onClick={() => setPage(1)}>
              <span className='sr-only'>First Page</span>
              <ChevronDoubleLeftIcon aria-hidden='true' className='h-5 w-5' />
            </PaginationDirectionButton>
            <PaginationDirectionButton
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <span className='sr-only'>Previous</span>
              <ChevronLeftIcon aria-hidden='true' className='h-5 w-5' />
            </PaginationDirectionButton>

            <input
              type='number'
              id='set-page-input-table'
              name='set-page'
              min={1}
              max={maxPage}
              className='block h-8 w-16 rounded-md border-2 border-gray-500/5 bg-white text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400'
              value={inputPageNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setInputPageNumber(1);
                } else {
                  const page = Math.min(Math.max(1, parseInt(value)), maxPage);
                  setInputPageNumber(page);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(inputPageNumber);
                }
              }}
              onBlur={() => setPage(inputPageNumber)}
            />

            <PaginationDirectionButton
              disabled={currentPage >= maxPage}
              onClick={() => setPage(currentPage + 1)}
            >
              <span className='sr-only'>Next</span>
              <ChevronRightIcon aria-hidden='true' className='h-5 w-5' />
            </PaginationDirectionButton>
            <PaginationDirectionButton
              disabled={currentPage >= maxPage}
              onClick={() => setPage(maxPage)}
            >
              <span className='sr-only'>Last Page</span>
              <ChevronDoubleRightIcon aria-hidden='true' className='h-5 w-5' />
            </PaginationDirectionButton>
          </nav>
        </div>
      </div>
    </div>
  );
}
