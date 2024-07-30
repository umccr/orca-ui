import { classNames } from '@/utils/utils';
import { Button } from '@headlessui/react';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';

export type PaginationProps = {
  totalCount: number;
  rowsPerPage: number;
  currentPage: number;
  setPage: (newPage: number) => void;
  countUnit?: string;
};

export default function Pagination({
  totalCount,
  rowsPerPage,
  countUnit,
  setPage,
  currentPage,
}: PaginationProps) {
  const [inputPageNumber, setInputPageNumber] = useState(currentPage);
  useEffect(() => {
    setInputPageNumber(currentPage);
  }, [currentPage]);

  const maxPage = Math.ceil(totalCount / rowsPerPage);
  const from = Math.min((currentPage - 1) * rowsPerPage + 1, totalCount);
  const to = Math.min((currentPage - 1) * rowsPerPage + rowsPerPage, totalCount);

  return (
    <div className='flex items-center justify-between border-t border-gray-200 bg-white pt-4 mt-2'>
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
      <div className='hidden md:flex md:flex-1 md:items-center md:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{from}</span> to{' '}
            <span className='font-medium'>{to}</span> of{' '}
            <span className='font-medium'>{totalCount}</span> {countUnit ?? 'results'}
          </p>
        </div>
        <div>
          <nav aria-label='Pagination' className='isolate inline-flex space-x-2 rounded-md'>
            <Button
              disabled={currentPage === 1}
              onClick={() => setPage(1)}
              className={classNames(
                currentPage === 1 ? 'bg-gray-50' : 'hover:bg-gray-100',
                'relative inline-flex items-center rounded-full p-2 text-gray-400 focus:z-20 focus:outline-offset-0'
              )}
            >
              <span className='sr-only'>First Page</span>
              <ChevronDoubleLeftIcon aria-hidden='true' className='h-5 w-5' />
            </Button>
            <Button
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className={classNames(
                currentPage === 1 ? 'bg-gray-50' : 'hover:bg-gray-100',
                'relative inline-flex items-center rounded-full p-2 text-gray-400 focus:z-20 focus:outline-offset-0'
              )}
            >
              <span className='sr-only'>Previous</span>
              <ChevronLeftIcon aria-hidden='true' className='h-5 w-5' />
            </Button>

            <input
              type='number'
              id='set-page-input-table'
              name='set-page'
              min={1}
              max={maxPage}
              className='block w-24 rounded-md border-0 bg-white px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
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

            <Button
              disabled={currentPage >= maxPage}
              onClick={() => setPage(currentPage + 1)}
              className={classNames(
                currentPage >= maxPage ? 'bg-gray-50' : 'hover:bg-gray-100',
                'relative inline-flex items-center rounded-full p-2 text-gray-400 focus:z-20 focus:outline-offset-0'
              )}
            >
              <span className='sr-only'>Next</span>
              <ChevronRightIcon aria-hidden='true' className='h-5 w-5' />
            </Button>
            <Button
              disabled={currentPage >= maxPage}
              onClick={() => setPage(maxPage)}
              className={classNames(
                currentPage >= maxPage ? 'bg-gray-50' : 'hover:bg-gray-100',
                'relative inline-flex items-center rounded-full p-2 text-gray-400 focus:z-20 focus:outline-offset-0'
              )}
            >
              <span className='sr-only'>Last Page</span>
              <ChevronDoubleRightIcon aria-hidden='true' className='h-5 w-5' />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
