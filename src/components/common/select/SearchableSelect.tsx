import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';
import { useState } from 'react';

interface SearchableSelectProps {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  examples?: string[];
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select dataset...',
  examples = [],
}: SearchableSelectProps) => {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className='w-full'>
      <Combobox value={value} onChange={onChange} onClose={() => setQuery('')}>
        <div className='relative'>
          <ComboboxInput
            className={classNames(
              'w-full rounded-lg py-2 pr-10 pl-3 text-sm',
              'bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-white',
              'border border-gray-200 dark:border-gray-700',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:outline-hidden data-focus:ring-2 data-focus:ring-blue-500',
              'transition duration-150'
            )}
            displayValue={(val: string) => val}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <ComboboxButton className='group absolute inset-y-0 right-0 px-2.5'>
            <ChevronUpDownIcon
              className={classNames(
                'h-5 w-5',
                'text-gray-400 group-data-hover:text-gray-600',
                'dark:text-gray-500 dark:group-data-hover:text-gray-300'
              )}
            />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor='bottom'
          transition
          className={classNames(
            'absolute z-10 mt-1 w-[var(--input-width)]',
            'max-h-60 overflow-auto rounded-lg',
            'bg-white dark:bg-gray-800',
            'p-1 shadow-lg',
            'ring-1 ring-black/5 dark:ring-white/10',
            '[--anchor-gap:0.25rem]',
            'transition duration-100',
            'data-leave:data-closed:opacity-0',
            'scrollbar-thin scrollbar-track-transparent',
            'scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600'
          )}
        >
          {filteredOptions.length === 0 && query !== '' ? (
            <div className='px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>Nothing found.</div>
          ) : (
            filteredOptions.map((option) => (
              <ComboboxOption
                key={option}
                value={option}
                className={classNames(
                  'group flex items-center justify-between gap-2',
                  'rounded-md px-3 py-1.5 select-none',
                  'text-gray-900 dark:text-gray-100',
                  'data-focus:bg-blue-50 dark:data-focus:bg-blue-900/50',
                  'transition-colors duration-75'
                )}
              >
                <span
                  className={classNames(
                    'text-xs',
                    'group-data-selected:font-medium',
                    'group-data-focus:text-blue-900 dark:group-data-focus:text-blue-100',
                    'truncate'
                  )}
                >
                  {option}
                </span>
                <CheckIcon
                  className={classNames(
                    'invisible h-3.5 w-3.5',
                    'shrink-0',
                    'text-blue-500 dark:text-blue-400',
                    'group-data-selected:visible'
                  )}
                />
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>

      {/* Example Datasets */}
      {examples.length > 0 && (
        <div className='mt-2 flex flex-row items-center gap-1'>
          <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
            Example datasets:
          </span>
          <div className='flex flex-wrap gap-1.5'>
            {examples.map((example) => (
              <button
                key={example}
                onClick={() => {
                  onChange(example);
                  setQuery('');
                }}
                className={classNames(
                  'rounded-md px-2 py-1 text-xs',
                  'bg-gray-100 dark:bg-gray-800',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-200 dark:hover:bg-gray-700',
                  'data-focus:ring-2 data-focus:ring-blue-500',
                  'transition-colors duration-150'
                )}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
