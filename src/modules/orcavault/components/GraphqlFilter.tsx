import { useState } from 'react';
import { DateRangePicker, DateSinglePicker } from '@/components/common/datepicker';
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
  value: string | string[];
};

type FieldType = 'string' | 'int' | 'float' | 'date' | 'timestamp';
export type FieldDefinition = {
  label: string;
  key: string;
  type: FieldType;
};

const inputWidth = 'w-[16rem]';

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
  string: ['eq', 'contains', 'beginsWith', 'ne'],
  float: ['eq', 'ne', 'gt', 'lt', 'ge', 'le', 'between'],
  int: ['eq', 'ne', 'gt', 'lt', 'ge', 'le', 'between'],
  date: ['eq', 'ne', 'ge', 'le', 'between'],
  timestamp: ['eq', 'ne', 'ge', 'le', 'between'],
};

const operatorLabels: Record<string, string> = {
  eq: 'Equal',
  ne: 'Not Equal',
  gt: 'Greater Than',
  lt: 'Less Than',
  ge: 'Greater Than or Equal',
  le: 'Less Than or Equal',
  between: 'Between',
  contains: 'Contains',
  beginsWith: 'Begins With',
};

type Props = { fieldFilters: FieldDefinition[] };

export const GraphqlFilter = ({ fieldFilters }: Props) => {
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

  const handleValueFilterChange = (index: number, val: string | string[]) => {
    const newFilters = [...filters];
    newFilters[index]['value'] = val;
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

        const currentFilterValue = filter.value;
        const isCurrentFilterValueArray = Array.isArray(currentFilterValue);

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
            <div className='relative flex w-[16rem] flex-wrap'>
              {(filter.operator === 'between' && fieldMeta.type === 'date') ||
              (filter.operator === 'between' && fieldMeta.type === 'timestamp') ? (
                <>
                  <DateRangePicker
                    align='left'
                    startDate={isCurrentFilterValueArray ? currentFilterValue[0] : null}
                    endDate={isCurrentFilterValueArray ? currentFilterValue[1] : null}
                    onTimeChange={(startDate: string | null, endDate: string | null) => {
                      if (!startDate || !endDate) {
                        throw new Error('Invalid date range');
                      }

                      if (fieldMeta.type === 'date') {
                        // Convert to YYYY-MM-DD format (AWSDate format)
                        handleValueFilterChange(index, [
                          startDate.slice(0, 10),
                          endDate.slice(0, 10),
                        ]);
                      } else {
                        // For timestamp, we can keep the full date string
                        handleValueFilterChange(index, [
                          dayjs(startDate).format('YYYY-MM-DD HH:mm:ss'),
                          dayjs(endDate).format('YYYY-MM-DD HH:mm:ss'),
                        ]);
                      }
                    }}
                    className={inputWidth}
                  />
                </>
              ) : filter.operator === 'between' &&
                (fieldMeta.type === 'int' || fieldMeta.type === 'float') ? (
                <div className='flex w-full flex-row gap-2'>
                  <input
                    type='number'
                    value={filter.value}
                    placeholder='Enter value'
                    onChange={(e) => handleValueFilterChange(index, e.target.value)}
                    className={classNames(inputThemeClassName, '')}
                  />
                  <input
                    type='number'
                    value={filter.value}
                    placeholder='Enter value'
                    onChange={(e) => handleValueFilterChange(index, e.target.value)}
                    className={classNames(inputThemeClassName, '')}
                  />
                </div>
              ) : fieldMeta.type === 'date' || fieldMeta.type === 'timestamp' ? (
                <>
                  <DateSinglePicker
                    align='left'
                    selectedDate={filter.value as string | null}
                    onDateChange={(date: string | null) => {
                      if (!date) {
                        throw new Error('Invalid date range');
                      }

                      // Convert to YYYY-MM-DD format (AWSDate format)
                      if (fieldMeta.type === 'date') {
                        handleValueFilterChange(index, date.slice(0, 10));
                      } else {
                        // For timestamp, we can keep the full date string
                        handleValueFilterChange(index, dayjs(date).format('YYYY-MM-DD HH:mm:ss'));
                      }
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

function buildGraphQLFilter(filters: Filter[]) {
  return {
    and: filters.map((f) => ({
      [f.key]: {
        [f.operator]: f.value,
      },
    })),
  };
}

function parseGraphQLFilter(graphqlFilter: {
  and: Record<string, Record<string, string | string[]>>[];
}): Filter[] {
  return graphqlFilter.and.map((filterObj) => {
    const [key, operatorObj] = Object.entries(filterObj)[0];
    const [operator, value] = Object.entries(operatorObj)[0];
    return { key, operator, value };
  });
}
