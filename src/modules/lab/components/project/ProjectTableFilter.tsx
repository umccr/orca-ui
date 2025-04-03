import { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';

import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { FilterTextInput } from '../utils';

type FilterType = {
  orcabusId?: string[];
  projectId?: string[];
  name?: string[];
};

export const ProjectTableFilter = () => {
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

  const ProjectFilter = () => (
    <>
      <FilterTextInput
        title='Orcabus ID *'
        keyFilter='orcabusId'
        defaultInput={filter.orcabusId ? filter.orcabusId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Project ID *'
        keyFilter='projectId'
        defaultInput={filter.projectId ? filter.projectId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Name *'
        keyFilter='name'
        defaultInput={filter.name ? filter.name : []}
        handleFilterChange={handleFilterChange}
      />
      <div className='text-s mb-2 border-b-2 pb-2 font-thin text-gray-700 italic'>
        {`*Text input support multi value with comma separated value. E.g. "L000001,L000002"`}
      </div>
    </>
  );

  return (
    <PopoverDropdown
      btnChildren={
        <Button
          type='gray'
          size='sm'
          className='w-full justify-center rounded-md ring-1 ring-gray-300'
        >
          <FunnelIcon className='h-5 w-5' />
        </Button>
      }
      content={
        <div className='z-10 w-80 rounded-lg bg-white'>
          <div className='max-h-[500px] overflow-y-auto px-3 pb-3 text-sm text-gray-700'>
            <ProjectFilter />
          </div>
          <ClosePopoverWrapper className='mt-4'>
            <Button
              className='w-full justify-center'
              type='red'
              onClick={() => {
                clearQueryParams();
              }}
            >
              Reset
            </Button>
          </ClosePopoverWrapper>

          <ClosePopoverWrapper>
            <Button
              className='mt-2 w-full justify-center'
              type='primary'
              onClick={() => {
                setQueryParams({ ...filter }, true);
              }}
            >
              Apply
            </Button>
          </ClosePopoverWrapper>
        </div>
      }
    />
  );
};
