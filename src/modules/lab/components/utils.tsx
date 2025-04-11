import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/common/checkbox';
import { classNames } from '@/utils/commonUtils';

interface FilterTextInputProps<T> {
  title?: string;
  keyFilter: keyof T;
  defaultInput: string | string[];
  handleFilterChange: (key: keyof T, value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const FilterTextInput = <T,>({
  title,
  keyFilter,
  defaultInput,
  handleFilterChange,
  disabled,
  placeholder = 'Enter values separated by commas...',
}: FilterTextInputProps<T>) => {
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (typeof defaultInput === 'string') setInput(defaultInput);
    else {
      setInput(defaultInput.join(','));
    }
  }, [defaultInput]);

  return (
    <div className='space-y-1.5'>
      {title && (
        <label className='block text-sm font-medium text-gray-900 dark:text-gray-100'>
          {title}
        </label>
      )}
      <div className='relative'>
        <input
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value.trim())}
          onBlur={() => {
            if (input === '') {
              handleFilterChange(keyFilter, []);
              return;
            }
            handleFilterChange(keyFilter, input.split(','));
          }}
          type='text'
          placeholder={placeholder}
          className={classNames(
            'block w-full rounded-md border-0 px-3 py-1.5 text-sm',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'ring-1 ring-gray-300 ring-inset dark:ring-gray-700',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:ring-2 focus:ring-blue-500/50 focus:ring-inset dark:focus:ring-blue-500/40',
            'hover:ring-gray-400 dark:hover:ring-gray-600',
            disabled && 'cursor-not-allowed opacity-50',
            'transition-all duration-200'
          )}
        />
      </div>
    </div>
  );
};

interface CheckboxGroupInputProps<T> {
  title?: string;
  keyFilter: keyof T;
  options: string[];
  handleIsCheckedFunc: (key: keyof T, value: string) => void;
  isCheckedFunc: (key: keyof T, value: string) => boolean;
  disabled?: boolean;
}

export const CheckboxGroupInput = <T,>({
  title,
  keyFilter,
  options,
  handleIsCheckedFunc,
  isCheckedFunc,
  disabled,
}: CheckboxGroupInputProps<T>) => {
  return (
    <div className='space-y-2'>
      {title && (
        <label className='block text-sm font-medium text-gray-900 dark:text-gray-100'>
          {title}
        </label>
      )}
      <div className='space-y-1'>
        {options.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className={classNames(
              'rounded-md px-2 py-0.5',
              !disabled && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
              'transition-colors duration-150'
            )}
          >
            <Checkbox
              checked={isCheckedFunc(keyFilter, item)}
              onChange={() => handleIsCheckedFunc(keyFilter, item)}
              label={item}
              disabled={disabled}
              size='sm'
            />
          </div>
        ))}
      </div>
    </div>
  );
};
