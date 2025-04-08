import { useEffect, useState } from 'react';
import { ClosePopoverWrapper, PopoverDropdown } from '@/components/common/dropdowns';
import { useQueryParams } from '@/hooks/useQueryParams';

import type { PhenotypeEnum, QualityEnum, TypeEnum, WorkflowEnum } from '@/api/metadata';
import { Button } from '@/components/common/buttons';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';
import { FilterTextInput, CheckboxGroupInput } from '../utils';

type FilterType = {
  orcabusId?: string[];
  libraryId?: string[];
  assay?: string[];
  individualId?: string[];
  'coverage[gte]'?: string;
  'coverage[lte]'?: string;
  projectId?: string[];
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

  const inputStyles = classNames(
    'block w-full rounded-md border-0 py-1.5 text-sm',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100',
    'ring-1 ring-inset ring-gray-300 dark:ring-gray-700',
    'focus:ring-2 focus:ring-inset focus:ring-blue-500/50 dark:focus:ring-blue-500/40',
    'hover:ring-gray-400 dark:hover:ring-gray-600',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    disabled && 'cursor-not-allowed opacity-50',
    'transition-all duration-200'
  );

  const labelStyles = classNames(
    'absolute -top-2 left-2 z-10',
    'px-1 text-xs font-medium',
    'bg-white dark:bg-transparent',
    'text-gray-500 dark:text-gray-400',
    disabled && 'opacity-50'
  );

  return (
    <div className='space-y-3'>
      <label className='block text-sm font-medium text-gray-900 dark:text-gray-100'>Coverage</label>
      <div className='flex items-center gap-3'>
        <div className='relative flex-1'>
          <label className={labelStyles}>Minimum</label>
          <input
            disabled={disabled}
            value={minInput && !isNaN(minInput) ? minInput : ''}
            onChange={(e) => setMinInput(e.target.value ? parseInt(e.target.value) : undefined)}
            onBlur={() => {
              if (minInput) {
                handleFilterChange('coverage[gte]', [minInput.toString()]);
              } else {
                handleFilterChange('coverage[gte]', []);
              }
            }}
            type='number'
            className={inputStyles}
          />
        </div>
        <div className='relative flex-1'>
          <label className={labelStyles}>Maximum</label>
          <input
            disabled={disabled}
            value={maxInput && !isNaN(maxInput) ? maxInput : ''}
            onChange={(e) => setMaxInput(e.target.value ? parseInt(e.target.value) : undefined)}
            onBlur={() => {
              if (maxInput) {
                handleFilterChange('coverage[lte]', [maxInput.toString()]);
              } else {
                handleFilterChange('coverage[lte]', []);
              }
            }}
            type='number'
            className={inputStyles}
          />
        </div>
      </div>
    </div>
  );
};

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

    if (typeof filter[key] === 'string') {
      currentFilterValue.push(filter[key] as string);
    }
    if (Array.isArray(filter[key])) {
      currentFilterValue.push(...(filter[key] as string[]));
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
    <div className='space-y-4'>
      <FilterTextInput
        title='Orcabus ID *'
        keyFilter='orcabusId'
        defaultInput={filter.orcabusId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Orcabus IDs...'
      />
      <FilterTextInput
        title='Library ID *'
        keyFilter='libraryId'
        defaultInput={filter.libraryId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Library IDs...'
      />
      <FilterTextInput
        title='Assay *'
        keyFilter='assay'
        defaultInput={filter.assay || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Assays...'
      />
      <FilterTextInput
        title='Individual ID (SBJ ID) *'
        keyFilter='individualId'
        defaultInput={filter.individualId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Individual IDs...'
      />
      <FilterTextInput
        title='Project ID *'
        keyFilter='projectId'
        defaultInput={filter.projectId || []}
        handleFilterChange={handleFilterChange}
        placeholder='Enter Project IDs...'
      />

      <div className='border-b border-gray-200 pb-3 text-xs text-gray-500 italic dark:border-gray-700 dark:text-gray-400'>
        * Text inputs support multiple values with comma separation (e.g.,
        &quot;L000001,L000002&quot;)
      </div>

      <CoverageFilter
        handleFilterChange={handleFilterChange}
        defaultMaxInput={filter['coverage[lte]'] ? parseInt(filter['coverage[lte]']) : undefined}
        defaultMinInput={filter['coverage[gte]'] ? parseInt(filter['coverage[gte]']) : undefined}
      />

      <CheckboxGroupInput
        title='Phenotype'
        keyFilter='phenotype'
        options={PHENOTYPE_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
      <CheckboxGroupInput
        title='Quality'
        keyFilter='quality'
        options={QUALITY_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
      <CheckboxGroupInput
        title='Type'
        keyFilter='type'
        options={TYPE_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
      <CheckboxGroupInput
        title='Workflow'
        keyFilter='workflow'
        options={WORKFLOW_OPTION}
        handleIsCheckedFunc={handleIsCheckedFunc}
        isCheckedFunc={isCheckedFilterActive}
      />
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
          <div className='max-h-[500px] overflow-y-auto p-4 text-sm'>
            <LibraryFilter />
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
