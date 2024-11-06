import React, { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';

import type { PhenotypeEnum, QualityEnum, TypeEnum, WorkflowEnum } from '@/api/metadata';
import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';
import { FilterTextInput } from '../utils';

type FilterType = {
  orcabusId?: string[];
  libraryId?: string[];
  assay?: string[];
  coverage__gte?: string;
  coverage__lte?: string;
  projectName?: string[];
  projectOwner?: string[];
  phenotype?: PhenotypeEnum[];
  quality?: QualityEnum[];
  type?: TypeEnum[];
  workflow?: WorkflowEnum[];
};

const PHENOTYPE_OPTION: PhenotypeEnum[] = ['normal', 'tumor', 'negative-control'];
const QUALITY_OPTION: QualityEnum[] = ['very-poor', 'poor', 'good', 'borderline'];
const TYPE_OPTION: TypeEnum[] = [
  '10X',
  'BiModal',
  'ctDNA',
  'ctTSO',
  'exome',
  'MeDIP',
  'Metagenm',
  'MethylSeq',
  'TSO-DNA',
  'TSO-RNA',
  'WGS',
  'WTS',
  'other',
];
const WORKFLOW_OPTION: WorkflowEnum[] = ['clinical', 'research', 'qc', 'control', 'bcl', 'manual'];

export const LibraryTableFilter = () => {
  const [filter, setFilter] = useState<FilterType>({});

  const { setQueryParams, getQueryParams, clearQueryParams } = useQueryParams();
  const filterJsonString = JSON.stringify(getQueryParams());
  useEffect(() => {
    const filterJson = JSON.parse(filterJsonString);
    setFilter(filterJson);
  }, [filterJsonString]);

  const handleIsCheckedFunc = (key: keyof FilterType, value: string) => {
    const currentFilterValue: string[] = [];

    if (typeof filter[key] == 'string') {
      currentFilterValue.push(filter[key]);
    }
    if (Array.isArray(filter[key])) {
      currentFilterValue.push(...filter[key]);
    }

    if (currentFilterValue.includes(value)) {
      const idx = currentFilterValue.indexOf(value);
      currentFilterValue.splice(idx, 1);
    } else {
      currentFilterValue.push(value);
    }

    setFilter((prev) => ({ ...prev, [key]: currentFilterValue }));
  };
  const isCheckedFilterActive = (key: keyof FilterType, value: string) => {
    const currentFilterValue = filter[key] || [];
    return currentFilterValue.includes(value);
  };

  const handleFilterChange = (key: keyof FilterType, value: string[]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const LibraryFilter = () => (
    <>
      <FilterTextInput
        title='Orcabus Id *'
        keyFilter='orcabusId'
        defaultInput={filter.orcabusId ? filter.orcabusId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Library Id *'
        keyFilter='libraryId'
        defaultInput={filter.libraryId ? filter.libraryId : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Assay *'
        keyFilter='assay'
        defaultInput={filter.assay ? filter.assay : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Project Name *'
        keyFilter='projectName'
        defaultInput={filter.projectName ? filter.projectName : []}
        handleFilterChange={handleFilterChange}
      />
      <FilterTextInput
        title='Project Owner *'
        keyFilter='projectOwner'
        defaultInput={filter.projectOwner ? filter.projectOwner : []}
        handleFilterChange={handleFilterChange}
      />
      <div className='border-b-2 mb-2 pb-2 italic text-s	text-gray-700 font-thin	'>
        {`*Text input support multi value with comma separated value. E.g. "L000001,L000002"`}
      </div>
      <CoverageFilter
        handleFilterChange={handleFilterChange}
        defaultMaxInput={filter.coverage__lte ? parseInt(filter.coverage__lte) : undefined}
        defaultMinInput={filter.coverage__gte ? parseInt(filter.coverage__gte) : undefined}
      />

      <CheckboxGroup
        title='Phenotype'
        keyFilter='phenotype'
        options={PHENOTYPE_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
      <CheckboxGroup
        title='Quality'
        keyFilter='quality'
        options={QUALITY_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
      <CheckboxGroup
        title='Type'
        keyFilter='type'
        options={TYPE_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
      <CheckboxGroup
        title='Workflow'
        keyFilter='workflow'
        options={WORKFLOW_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
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
          <div className='max-h-[500px] px-3 pb-3 overflow-y-auto text-sm text-gray-700 '>
            <LibraryFilter />
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

const CoverageFilter = ({
  defaultMinInput,
  defaultMaxInput,
  handleFilterChange,
  disabled = false,
}: {
  defaultMinInput?: number;
  defaultMaxInput?: number;
  handleFilterChange: (key: keyof FilterType, value: string[]) => void;
  disabled?: boolean;
}) => {
  const [minInput, setMinInput] = useState(defaultMinInput);
  const [maxInput, setMaxInput] = useState(defaultMaxInput);

  return (
    <>
      <div className='font-medium mb-2'>{`Coverage`}</div>
      <div className='relative inline-block text-left cursor-pointer w-24'>
        <label
          className={classNames(
            'absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 start-1'
          )}
        >
          {`Minimum`}
        </label>
        <input
          disabled={disabled}
          value={minInput}
          onChange={(e) => setMinInput(parseInt(e.target.value))}
          onBlur={() => {
            if (minInput) {
              handleFilterChange('coverage__gte', [minInput.toString()]);
            }
          }}
          type='number'
          className='my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-2.5'
        />
      </div>
      <div className='ml-2 relative inline-block text-left cursor-pointer w-24'>
        <label
          className={classNames(
            'absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 start-1'
          )}
        >
          {`Maximum`}
        </label>
        <input
          disabled={disabled}
          value={maxInput}
          onChange={(e) => setMaxInput(parseInt(e.target.value))}
          onBlur={() => {
            if (maxInput) {
              handleFilterChange('coverage__lte', [maxInput.toString()]);
            }
          }}
          type='number'
          className='my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-2.5'
        />
      </div>
    </>
  );
};

const CheckboxGroup = ({
  title,
  keyFilter,
  options,
  handleIsCheckedFunc,
  isCheckedFunc,
}: {
  title: string;
  keyFilter: keyof FilterType;
  options: string[];
  handleIsCheckedFunc: (key: keyof FilterType, value: string) => void;
  isCheckedFunc: (key: keyof FilterType, value: string) => boolean;
}) => {
  return (
    <>
      <div className='font-medium'>{title}</div>
      {options.map((item, key) => (
        <div
          key={`${keyFilter}-${key}`}
          className='flex items-center ps-2 rounded hover:bg-gray-100 cursor-pointer'
          onClick={() => {
            handleIsCheckedFunc(keyFilter, item);
          }}
        >
          <input
            readOnly
            checked={isCheckedFunc(keyFilter, item)}
            type='checkbox'
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500/50 focus:ring-2 cursor-pointer'
          />
          <label className='w-full py-2 ms-2 text-sm font-normal text-gray-900 rounded cursor-pointer'>
            {item}
          </label>
        </div>
      ))}
    </>
  );
};
