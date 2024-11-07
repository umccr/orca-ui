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
