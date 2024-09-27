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
        'relative inline-flex items-center rounded-full !p-0 h-7 text-gray-400 focus:z-20 focus:outline-offset-0',
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
    <div className='flex items-center justify-between pt-4 mt-2'>
      {/* mobile pagination */}
      <div className='flex flex-1 justify-between md:hidden'>
        <Button
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
          className={classNames(
            currentPage === 1 ? '' : 'hover:bg-gray-50',
            'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700'
          )}
        >
          Previous
        </Button>
        <Button
          disabled={currentPage >= maxPage}
          onClick={() => setPage(currentPage + 1)}
          className={classNames(
            currentPage === 1 ? '' : 'hover:bg-gray-50',
            'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700'
          )}
        >
          Next
        </Button>
      </div>
      {/* Pagination */}
      <div className='hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-3'>
        <div className='flex flex-row'>
          <p className='text-sm text-gray-700 font-medium text-nowrap pl-2 pr-1'>
            <span className='font-medium'>{from}</span> to <span className='font-medium'>{to}</span>{' '}
            of <span className='font-medium'>{totalCount}</span> {countUnit}
          </p>
        </div>

        {/* Rows per page: */}
        <div className='flex flex-row items-center'>
          <label
            htmlFor='rows-per-page'
            className='text-sm text-gray-700 font-medium text-nowrap pl-2 pr-1'
          >
            Rows per page:
          </label>
          <select
            id='rows-per-page'
            name='rows-per-page'
            className='block text-sm my-1 w-16 h-7 p-1 pl-2 rounded border-gray-300 bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500/75'
            value={rowsPerPageNumber}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
            }}
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
            className='isolate inline-flex space-x-2 rounded-md items-center'
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
              className='block w-16 h-7 my-1 text-sm rounded-md border-0 bg-white px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500/75'
              value={inputPageNumber}
              onChange={(e) => {
                if (e.target.value === '') {
                  setInputPageNumber(1);
                } else {
                  setInputPageNumber(parseInt(e.target.value ?? 1));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(inputPageNumber);
                }
              }}
              onBlur={() => {
                setPage(inputPageNumber);
              }}
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
