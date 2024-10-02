import React, { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';

import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';

type FilterType = {
  orcabusId?: string[];
  sampleId?: string[];
  externalSampleId?: string[];
  source?: string[];
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

  const IndividualFilter = () => (
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
            <IndividualFilter />
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

          <Button
            className='w-full justify-center mt-2'
            type='primary'
            onClick={() => {
              setQueryParams({ ...filter }, true);
            }}
          >
            Apply
          </Button>
        </div>
      }
    />
  );
};

const FilterTextInput = ({
  title,
  keyFilter,
  defaultInput,
  handleFilterChange,
}: {
  title?: string;
  keyFilter: keyof FilterType;
  defaultInput: string | string[];
  handleFilterChange: (key: keyof FilterType, value: string[]) => void;
  disabled?: boolean;
}) => {
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (typeof defaultInput === 'string') setInput(defaultInput);
    else {
      setInput(defaultInput.join(','));
    }
  }, [defaultInput]);

  return (
    <>
      {title && <div className='font-medium'>{title}</div>}
      <div className='pl-2'>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.trim())}
          onBlur={() => {
            if (input == '') {
              handleFilterChange(keyFilter, []);
              return;
            } else {
              handleFilterChange(keyFilter, input.split(','));
            }
          }}
          type='text'
          className='my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-2.5'
        />
      </div>
    </>
  );
};