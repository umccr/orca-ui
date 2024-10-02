import { MagnifyingGlassIcon, XMarkIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Tooltip } from '@/components/common/tooltips';
import { useState, useEffect, FC } from 'react';

interface SearchProps {
  searchBoxContent?: string;
  hasTooltip?: boolean;
  onSearch: (search: string | null) => void;
}

const Search: FC<SearchProps> = ({ onSearch, searchBoxContent, hasTooltip }) => {
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
    <div className='flex flex-row items-center'>
      <div className='flex-1 '>
        <label htmlFor='search' className='sr-only'>
          Search
        </label>
        <div
          className='relative inline-flex justify-center items-center'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
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
            className='block w-full h-8 rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1  ring-gray-300 placeholder:text-gray-400 focus:ring-2  focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='Search'
            type='search'
          />
          {showXMark && (
            <div
              className='pointer-events-auto cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 z-10'
              onClick={() => {
                setSearchBox('');
                onSearch(null);
              }}
            >
              <XMarkIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </div>
          )}
        </div>
      </div>
      {showTooltip && (
        <Tooltip
          text='Available Search Items:  workflowRunName, comment, libraryId, orcabusId, workflowName'
          position='top'
          background='white'
        >
          <QuestionMarkCircleIcon className='h-7 w-7 text-slate-300 pl-1 cursor-pointer' />
        </Tooltip>
      )}
    </div>
  );
};

export default Search;
