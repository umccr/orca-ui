import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { FC, useEffect, useState } from 'react';

interface TableSearchHeaderProps {
  searchBox: string;
  setDataQueryParams: (params: Record<string, string>) => void;
  clearQueryParams: () => void;
}

const TableSearchHeader: FC<TableSearchHeaderProps> = ({
  searchBox,
  setDataQueryParams,
  clearQueryParams,
}) => {
  const [searchBoxValue, setSearchBoxValue] = useState<string>(searchBox);
  useEffect(() => {
    setSearchBoxValue(searchBox);
  }, [searchBox]);
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='flex flex-1 items-center pt-2'>
        <div className='w-full max-w-lg md:max-w-xs'>
          <label htmlFor='search' className='sr-only'>
            Search
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </div>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchBox.startsWith('S')) {
                    setDataQueryParams({ internal_id: searchBox });
                  } else {
                    setDataQueryParams({ library_internal_id: searchBox });
                  }
                }
              }}
              onChange={(e) => {
                setSearchBoxValue(e.target.value.trim());
                if (!e.target.value) {
                  setDataQueryParams({});
                }
              }}
              value={searchBoxValue}
              id='search'
              name='search'
              className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder='Search (SubjectId or LibraryId)'
              type='search'
            />
          </div>
        </div>
        <button
          onClick={() => {
            clearQueryParams();
            setSearchBoxValue('');
          }}
          className='ml-2 text-sm text-gray-400 hover:text-gray-600'
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default TableSearchHeader;
