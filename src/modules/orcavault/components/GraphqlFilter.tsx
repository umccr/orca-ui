import { useState } from 'react';
import { DateSinglePicker } from '@/components/common/datepicker';
import { classNames } from '@/utils/commonUtils';
import { Button } from '@/components/common/buttons';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Select } from '@/components/common/select';
import dayjs from 'dayjs';
import toaster from '@/components/common/toaster';

type Filter = {
  key: string;
  operator: string;
  value: string;
};

type FieldType = 'string' | 'int' | 'float' | 'date' | 'timestamp';
export type FieldDefinition = {
  label: string;
  key: string;
  type: FieldType;
};

const inputWidth = 'w-[10rem]';

const inputThemeClassName = classNames(
  'block w-full border text-sm',
  'border-gray-200 dark:border-gray-700',
  'rounded-md',
  'bg-white dark:bg-gray-800',
  'text-gray-900 dark:text-gray-100',
  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'focus:ring-2 focus:ring-blue-500/50 focus:ring-inset dark:focus:ring-blue-500/40',
  'hover:border-gray-300 dark:hover:border-gray-600',
  'transition-all duration-200'
);

const operatorsByType: Record<FieldType, string[]> = {
  string: ['equalTo', 'in', 'startsWith', 'notEqualTo'],
  float: [
    'equalTo',
    'notEqualTo',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqualTo',
    'lessThanOrEqualTo',
  ],
  int: [
    'equalTo',
    'notEqualTo',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqualTo',
    'lessThanOrEqualTo',
  ],
  date: ['greaterThanOrEqualTo', 'lessThanOrEqualTo'],
  timestamp: ['greaterThanOrEqualTo', 'lessThanOrEqualTo'],
};

const operatorLabels: Record<string, string> = {
  equalTo: 'Equal',
  notEqualTo: 'Not equal',
  greaterThan: 'Greater than',
  lessThan: 'Less than',
  greaterThanOrEqualTo: 'Greater equal',
  lessThanOrEqualTo: 'Less equal',
  in: 'in',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
};

type Props = {
  fieldFilters: FieldDefinition[];
  buildGraphQLFilter: (filters: Filter[]) => unknown;
};

export const GraphqlFilter = ({ fieldFilters, buildGraphQLFilter }: Props) => {
  const { setQueryParams, getQueryParams, clearQueryParams } = useQueryParams();
  const currentQueryFilter = getQueryParams().filter;

  const [filters, setFilters] = useState<Filter[]>(
    currentQueryFilter ? parseGraphQLFilter(JSON.parse(currentQueryFilter)) : []
  );

  const handleOperatorFilterChange = (index: number, val: string) => {
    const newFilters = [...filters];
    newFilters[index]['operator'] = val;
    setFilters(newFilters);
  };

  const handleValueFilterChange = (index: number, val: string) => {
    const newFilters = [...filters];
    newFilters[index]['value'] = val;
    console.log(val);
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const [newFilterKey, setNewFilterKey] = useState<string>(fieldFilters[0].key);
  const addFilter = () => {
    if (!newFilterKey) return;
    const fieldMeta = fieldFilters.find((f) => f.key === newFilterKey);
    if (!fieldMeta) throw new Error('No Field filter found!');
    const operatorOptions = operatorsByType[fieldMeta?.type];
    setFilters([...filters, { key: newFilterKey, operator: operatorOptions[0], value: '' }]);
  };

  return (
    <div className='mt-12'>
      <div className='mb-4 text-lg font-medium'>Filters</div>
      {filters.map((filter, index) => {
        // Take the filter information for the current filter
        const fieldMeta = fieldFilters.find((f) => f.key === filter.key);
        if (!fieldMeta) throw new Error('No Field filter found!');
        const operatorOptions = operatorsByType[fieldMeta?.type];

        return (
          <div key={index} className='mt-2 flex flex-row items-center gap-2'>
            <div>
              <Button
                size='md'
                onClick={() => removeFilter(index)}
                className={classNames(
                  'inline-flex items-center rounded-md p-1.5',
                  'border border-gray-200 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-500 dark:text-gray-400',
                  'shadow-sm dark:shadow-gray-900/30',
                  'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  'hover:text-gray-600 dark:hover:text-gray-300',
                  'hover:border-gray-300 dark:hover:border-gray-600',
                  'focus:ring-2 focus:outline-none',
                  'focus:ring-blue-500/30 dark:focus:ring-blue-400/30',
                  'active:bg-gray-100 dark:active:bg-gray-700',
                  'transition-all duration-200'
                )}
              >
                <TrashIcon className='h-5 w-5' />
              </Button>
            </div>
            <div className='flex w-38 flex-row text-sm text-gray-700 dark:text-gray-300'>
              {fieldMeta.label}
            </div>

            {/* First the operators for the value */}
            <div className='relative flex flex-wrap'>
              <Select
                value={filter.operator}
                onChange={(value) => handleOperatorFilterChange(index, value)}
                options={operatorOptions.map((op) => ({ label: operatorLabels[op], value: op }))}
              />
            </div>

            {/* The value for each corresponding filter */}
            <div className='relative flex w-[10rem] flex-wrap'>
              {fieldMeta.type === 'date' || fieldMeta.type === 'timestamp' ? (
                <>
                  <DateSinglePicker
                    align='left'
                    selectedDate={filter.value as string | null}
                    onDateChange={(date: string | null) => {
                      if (!date) {
                        throw new Error('Invalid date range');
                      }
                      handleValueFilterChange(index, dayjs(date).format('YYYY-MM-DD'));
                    }}
                    className={inputWidth}
                  />
                </>
              ) : fieldMeta.type === 'float' || fieldMeta.type === 'int' ? (
                <>
                  <input
                    type='number'
                    value={filter.value}
                    placeholder='Enter value'
                    onChange={(e) => handleValueFilterChange(index, e.target.value)}
                    className={inputThemeClassName}
                  />
                </>
              ) : (
                <div className='relative w-full'>
                  <input
                    type='text'
                    value={filter.value}
                    placeholder='Enter value'
                    onChange={(e) => handleValueFilterChange(index, e.target.value)}
                    className={inputThemeClassName}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className='mt-[2rem] flex flex-row items-center justify-center gap-2'>
        <Select
          value={newFilterKey}
          onChange={(value) => setNewFilterKey(value)}
          options={fieldFilters.map((field) => ({ label: field.label, value: field.key }))}
          className='min-w-[12rem]'
        />
        <Button
          className='justify-center border-none text-gray-700 dark:text-gray-300'
          type='light'
          onClick={addFilter}
          size='xs'
        >
          Add Filter
          <PlusCircleIcon className='h-5 w-5' />
        </Button>
      </div>
      <div className='mt-8 flex flex-col gap-2'>
        <Button
          className='w-full justify-center'
          type='light'
          onClick={() => {
            setFilters([]);
            clearQueryParams();
          }}
        >
          Reset
        </Button>

        <Button
          className='w-full justify-center'
          type='primary'
          onClick={() => {
            if (filters.length === 0 || filters.find((f) => !f.value)) {
              toaster.error({ title: 'Error', message: 'One or more filter value is empty!' });
              return;
            }
            setQueryParams({ filter: JSON.stringify(buildGraphQLFilter(filters)) });
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

function parseGraphQLFilter(graphqlFilter: {
  and: Record<string, Record<string, string>>[];
}): Filter[] {
  return graphqlFilter.and.map((filterObj) => {
    const [key, operatorObj] = Object.entries(filterObj)[0];
    const [operator, value] = Object.entries(operatorObj)[0];
    return { key, operator, value };
  });
}
