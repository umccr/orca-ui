import { useEffect, useState } from 'react';

interface FilterTextInputProps<T> {
  title?: string;
  keyFilter: keyof T;
  defaultInput: string | string[];
  handleFilterChange: (key: keyof T, value: string[]) => void;
  disabled?: boolean;
}

export const FilterTextInput = <T,>({
  title,
  keyFilter,
  defaultInput,
  handleFilterChange,
}: FilterTextInputProps<T>) => {
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
          className='my-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500/50 focus:ring-blue-500/50'
        />
      </div>
    </>
  );
};

interface CheckboxGroupInputProps<T> {
  title?: string;
  keyFilter: keyof T;
  options: string[];
  handleIsCheckedFunc: (key: keyof T, value: string) => void;
  isCheckedFunc: (key: keyof T, value: string) => boolean;
}
export const CheckboxGroupInput = <T,>({
  title,
  keyFilter,
  options,
  handleIsCheckedFunc,
  isCheckedFunc,
}: CheckboxGroupInputProps<T>) => {
  return (
    <>
      {title && <div className='font-medium'>{title}</div>}
      {options.map((item, key) => (
        <div
          key={`${title}-${key}`}
          className='flex cursor-pointer items-center rounded-sm ps-2 hover:bg-gray-100'
          onClick={() => {
            handleIsCheckedFunc(keyFilter, item);
          }}
        >
          <input
            readOnly
            checked={isCheckedFunc(keyFilter, item)}
            type='checkbox'
            className='h-4 w-4 cursor-pointer rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500/50'
          />
          <label className='ms-2 w-full cursor-pointer rounded-sm py-2 text-sm font-normal text-gray-900'>
            {item}
          </label>
        </div>
      ))}
    </>
  );
};
