import React, { useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';

import type { PhenotypeEnum, QualityEnum, TypeEnum, WorkflowEnum } from '@/api/metadata';
import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';

type FilterType = {
  assay?: string[];
  // coverage?: number[];
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

export const MetadataFilterDropdown = () => {
  const { setQueryParams, getQueryParams, clearQueryParams } = useQueryParams();

  const [filter, setFilter] = useState<FilterType>(getQueryParams());
  const handleFilterChange = (key: keyof FilterType, value: string) => {
    const currentFilterValue = filter[key] || [];

    if (currentFilterValue.includes(value)) {
      const idx = currentFilterValue.indexOf(value);
      currentFilterValue.splice(idx, 1);
    } else {
      currentFilterValue.push(value);
    }

    setFilter((prev) => ({ ...prev, [key]: currentFilterValue }));
  };
  const isFilterActive = (key: keyof FilterType, value: string) => {
    const currentFilterValue = filter[key] || [];
    return currentFilterValue.includes(value);
  };

  console.log(filter);
  return (
    <PopoverDropdown
      btnChildren={
        <Button type='green' className='w-full justify-center'>
          <FunnelIcon className='h-5 w-5' />
        </Button>
      }
      content={
        <div className='z-10 bg-white rounded-lg w-60'>
          <div className='h-96 px-3 pb-3 overflow-y-auto text-sm text-gray-700 '>
            <CheckboxGroup
              title='Phenotype'
              keyFilter='phenotype'
              options={PHENOTYPE_OPTION}
              handleIsCheckedFunc={handleFilterChange}
              isCheckedFunc={isFilterActive}
            />
            <CheckboxGroup
              title='Quality'
              keyFilter='quality'
              options={QUALITY_OPTION}
              handleIsCheckedFunc={handleFilterChange}
              isCheckedFunc={isFilterActive}
            />
            <CheckboxGroup
              title='Type'
              keyFilter='type'
              options={TYPE_OPTION}
              handleIsCheckedFunc={handleFilterChange}
              isCheckedFunc={isFilterActive}
            />
            <CheckboxGroup
              title='Workflow'
              keyFilter='workflow'
              options={WORKFLOW_OPTION}
              handleIsCheckedFunc={handleFilterChange}
              isCheckedFunc={isFilterActive}
            />
          </div>
          <ClosePopoverWrapper>
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
              setQueryParams(filter);
            }}
          >
            Apply
          </Button>
        </div>
      }
    />
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
          onClick={() => handleIsCheckedFunc(keyFilter, item)}
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

// const InputGroup = ({
//   title,
//   keyFilter,
//   handleIsCheckedFunc,
//   defaultInput,
// }: {
//   title: string;
//   keyFilter: keyof FilterType;
//   options: string[];
//   handleIsCheckedFunc: (key: keyof FilterType, value: string) => void;
//   isCheckedFunc: (key: keyof FilterType, value: string) => boolean;
// }) => {
//   const [input, setInput] = useState('');
//   return (
//     <>
//       <div className='font-medium'>{title}</div>
//       <input
//         type='text'
//         id='input-group-search'
//         className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500/50 focus:border-blue-500/50 block w-full ps-10 p-2.5'
//         placeholder='Search user'
//       />
//     </>
//   );
// };
