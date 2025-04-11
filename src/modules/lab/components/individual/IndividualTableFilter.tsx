import { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { FilterTextInput } from '../utils';
import { classNames } from '@/utils/commonUtils';

type FilterType = {
  orcabusId?: string[];
  individualId?: string[];
};

export const IndividualTableFilter = () => {
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

  const IndividualFilter = () => (
    <div className='space-y-4'>
      <FilterTextInput
        title='Orcabus ID *'
        keyFilter='orcabusId'
        defaultInput={filter.orcabusId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Orcabus IDs...'
      />
      <FilterTextInput
        title='Individual ID *'
        keyFilter='individualId'
        defaultInput={filter.individualId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Individual IDs...'
      />
      <div className='border-b border-gray-200 pb-3 text-xs text-gray-500 italic dark:border-gray-700 dark:text-gray-400'>
        * Text inputs support multiple values with comma separation (e.g.,
        &quot;L000001,L000002&quot;)
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
            <IndividualFilter />
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
