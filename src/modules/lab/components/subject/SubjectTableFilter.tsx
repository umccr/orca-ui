import { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { FilterTextInput } from '../utils';
import { classNames } from '@/utils/commonUtils';

type FilterType = {
  orcabusId?: string[];
  libraryId?: string[];
  subjectId?: string[];
  individualId?: string[];
  isLibraryNone?: boolean;
};

export const SubjectTableFilter = () => {
  const [filter, setFilter] = useState<FilterType>({});

  const { setQueryParams, getQueryParams, clearQueryParams } = useQueryParams();
  const filterJsonString = JSON.stringify(getQueryParams());
  useEffect(() => {
    const filterJson = JSON.parse(filterJsonString);
    setFilter(filterJson);
  }, [filterJsonString]);

  const handleFilterChange = (key: keyof FilterType, value: string[]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const SubjectFilter = () => (
    <div className='space-y-4'>
      <FilterTextInput
        title='Orcabus ID *'
        keyFilter='orcabusId'
        defaultInput={filter.orcabusId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Orcabus IDs...'
      />
      <FilterTextInput
        title='Subject ID *'
        keyFilter='subjectId'
        defaultInput={filter.subjectId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Subject IDs...'
      />
      <FilterTextInput
        title='Individual ID (SBJ ID) *'
        keyFilter='individualId'
        defaultInput={filter.individualId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Individual IDs...'
      />
      <FilterTextInput
        title='Library ID *'
        keyFilter='libraryId'
        defaultInput={filter.libraryId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Library IDs...'
      />

      <div className='border-b border-gray-200 pb-3 text-xs text-gray-500 italic dark:border-gray-700 dark:text-gray-400'>
        * Text inputs support multiple values with comma separation (e.g.,
        &quot;L000001,L000002&quot;)
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-900 dark:text-white'>Library</label>
        <div
          className={classNames(
            'group flex items-center gap-2 rounded-md p-2',
            'cursor-pointer transition-colors duration-200',
            'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          )}
          onClick={() => {
            setFilter((prev) => ({ ...prev, isLibraryNone: !prev['isLibraryNone'] }));
          }}
        >
          <div
            className={classNames('relative h-4 w-4 shrink-0', 'flex items-center justify-center')}
          >
            <input
              readOnly
              checked={filter['isLibraryNone']}
              type='checkbox'
              className={classNames(
                'h-4 w-4 rounded',
                'border-gray-300 dark:border-gray-600',
                'text-blue-600 dark:text-blue-500',
                'focus:ring-blue-500/50 dark:focus:ring-blue-500/40',
                'bg-white dark:bg-gray-800',
                'cursor-pointer transition-colors duration-200'
              )}
            />
          </div>
          <span className='text-sm text-gray-700 dark:text-gray-300'>Empty library</span>
        </div>
      </div>
    </div>
  );

  return (
    <PopoverDropdown
      btnChildren={
        <Button
          type='gray'
          size='sm'
          className={classNames(
            'w-full justify-center rounded-md',
            'ring-1 ring-gray-300 dark:ring-gray-700',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            'transition-colors duration-200'
          )}
        >
          <FunnelIcon className='h-5 w-5' />
        </Button>
      }
      content={
        <div className='w-80 rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10'>
          <div className='max-h-[500px] overflow-y-auto p-6 text-sm'>
            <SubjectFilter />
          </div>

          <div className='space-y-2 border-t border-gray-200 p-4 dark:border-gray-700'>
            <ClosePopoverWrapper>
              <Button
                className='w-full justify-center'
                type='red'
                onClick={() => clearQueryParams()}
              >
                Reset
              </Button>
            </ClosePopoverWrapper>

            <ClosePopoverWrapper>
              <Button
                className='w-full justify-center'
                type='primary'
                onClick={() => setQueryParams({ ...filter }, true)}
              >
                Apply
              </Button>
            </ClosePopoverWrapper>
          </div>
        </div>
      }
    />
  );
};
