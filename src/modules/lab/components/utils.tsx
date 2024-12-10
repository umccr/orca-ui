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
          className='my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-2.5'
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
