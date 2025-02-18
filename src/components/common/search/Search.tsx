import { MagnifyingGlassIcon, XMarkIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Tooltip } from '@/components/common/tooltips';
import { useState, useEffect, FC } from 'react';

interface SearchProps {
  searchBoxContent?: string;
  hasTooltip?: boolean;
  tooltipText?: string;
  onSearch: (search: string | null) => void;
  placeholder?: string;
}

const Search: FC<SearchProps> = ({
  onSearch,
  searchBoxContent,
  hasTooltip,
  tooltipText,
  placeholder = 'Search',
}) => {
  const [searchBox, setSearchBox] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const showXMark = isFocused || isHovered || searchBox.length > 0;

  useEffect(() => {
    setSearchBox(searchBoxContent || '');
    setShowTooltip(hasTooltip || false);
  }, [searchBoxContent, hasTooltip]);

  return (
    <div className='flex w-full flex-row items-center gap-2'>
      <div className='relative flex-1'>
        <label htmlFor='search' className='sr-only'>
          Search
        </label>
        <div
          className='relative flex w-full flex-row items-center rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md dark:shadow-gray-800'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <MagnifyingGlassIcon
              className='h-5 w-5 text-gray-400 dark:text-gray-500'
              aria-hidden='true'
            />
          </div>
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(searchBox);
              }
            }}
            onChange={(e) => {
              setSearchBox(e.target.value.trim());
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={searchBox}
            id='search'
            name='search'
            className='block h-8 w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-sm text-gray-900 ring-1 ring-gray-300 transition-all duration-200 ease-in-out placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-blue-500'
            placeholder={placeholder}
            type='search'
          />
          {showXMark && (
            <div
              className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 transition-opacity duration-200 hover:opacity-80'
              onClick={() => {
                setSearchBox('');
                onSearch(null);
              }}
            >
              <XMarkIcon className='h-5 w-5 text-gray-400 dark:text-gray-500' aria-hidden='true' />
            </div>
          )}
        </div>
      </div>
      {showTooltip && (
        <Tooltip
          text={tooltipText || ''}
          position='top'
          size='small'
          background='light'
          className='min-w-[300px] max-w-[600px] whitespace-normal'
        >
          <QuestionMarkCircleIcon className='h-7 w-7 cursor-pointer pl-1 text-slate-300 transition-opacity duration-200 hover:opacity-80 dark:text-gray-600' />
        </Tooltip>
      )}
    </div>
  );
};

export default Search;
