import { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';

import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { FilterTextInput } from '../utils';

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
    <>
      <FilterTextInput
        title='Orcabus ID *'
        keyFilter='orcabusId'
        defaultInput={filter.orcabusId ? filter.orcabusId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Subject ID *'
        keyFilter='subjectId'
        defaultInput={filter.subjectId ? filter.subjectId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Individual ID (SBJ ID) *'
        keyFilter='individualId'
        defaultInput={filter.individualId ? filter.individualId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Library ID *'
        keyFilter='libraryId'
        defaultInput={filter.libraryId ? filter.libraryId : []}
        handleFilterChange={handleFilterChange}
      />

      <div className='text-s mb-2 border-b-2 pb-2 font-thin italic text-gray-700'>
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
            <SubjectFilter />

            <div className='font-medium'>{`Library`}</div>
            <div
              className='flex cursor-pointer items-center rounded ps-2 hover:bg-gray-100'
              onClick={() => {
                setFilter((prev) => ({ ...prev, isLibraryNone: !prev['isLibraryNone'] }));
              }}
            >
              <input
                readOnly
                checked={filter['isLibraryNone']}
                type='checkbox'
                className='h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500/50'
              />
              <label className='ms-2 w-full cursor-pointer rounded py-2 text-sm font-normal text-gray-900'>
                Empty library
              </label>
            </div>
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
