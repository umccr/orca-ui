import React, { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';

import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { FilterTextInput } from '../utils';

type FilterType = {
  orcabusId?: string[];
  sampleId?: string[];
  externalSampleId?: string[];
  source?: string[];
  isLibraryNone?: boolean;
};

export const SampleTableFilter = () => {
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

  const SampleFilter = () => (
    <>
      <FilterTextInput
        title='Orcabus Id *'
        keyFilter='orcabusId'
        defaultInput={filter.orcabusId ? filter.orcabusId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Sample Id *'
        keyFilter='sampleId'
        defaultInput={filter.sampleId ? filter.sampleId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='External Sample Id *'
        keyFilter='externalSampleId'
        defaultInput={filter.externalSampleId ? filter.externalSampleId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Source *'
        keyFilter='source'
        defaultInput={filter.source ? filter.source : []}
        handleFilterChange={handleFilterChange}
      />
      <div className='border-b-2 mb-2 pb-2 italic text-s	text-gray-700 font-thin	'>
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
          className='w-full justify-center rounded-md ring-gray-300 ring-1'
        >
          <FunnelIcon className='h-5 w-5' />
        </Button>
      }
      content={
        <div className='z-10 bg-white rounded-lg w-80'>
          <div className='max-h-[250px] px-3 pb-3 overflow-y-auto text-sm text-gray-700 '>
            <SampleFilter />
            <div className='font-medium'>{`Library`}</div>
            <div
              className='flex items-center ps-2 rounded hover:bg-gray-100 cursor-pointer'
              onClick={() => {
                setFilter((prev) => ({ ...prev, isLibraryNone: !prev['isLibraryNone'] }));
              }}
            >
              <input
                readOnly
                checked={filter['isLibraryNone']}
                type='checkbox'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500/50 focus:ring-2 cursor-pointer'
              />
              <label className='w-full py-2 ms-2 text-sm font-normal text-gray-900 rounded cursor-pointer'>
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
              className='w-full justify-center mt-2'
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
