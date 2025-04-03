import { useEffect, useState, FC } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';

export interface SelectItems {
  label: string;
  value: string | number;
  secondaryLabel?: string;
}

interface SelectProps {
  groupLabel?: string;
  value: SelectItems;
  options: SelectItems[];
  onChange: (value: SelectItems) => void;
}

const SingleSelect: FC<SelectProps> = ({ groupLabel, value, options, onChange }) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (value: SelectItems) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <Listbox value={selected} onChange={handleSelect}>
      {groupLabel && (
        <Label className='block text-sm leading-6 font-medium text-gray-900'>{groupLabel}</Label>
      )}
      <div className='relative mt-2'>
        <ListboxButton
          className={classNames(
            'relative w-full rounded-lg bg-white py-1.5 pr-10 pl-3 text-left text-sm/6 text-gray-900',
            'focus:outline-hidden data-focus:outline-2 data-focus:-outline-offset-2',
            'focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6',
            'shadow-xs ring-1 ring-gray-300 ring-inset'
          )}
        >
          <div className='flex flex-row text-sm/6 font-normal'>
            {/* <div className='text-black '>{selected.label}</div> */}
            <span className='block truncate'>{selected.label}</span>
            {selected.secondaryLabel && (
              <div className='pl-4 text-gray-500'>{selected.secondaryLabel}</div>
            )}
          </div>

          {/* <ChevronUpDownIcon
            className='group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-gray-900'
            aria-hidden='true'
          /> */}
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <ChevronUpDownIcon aria-hidden='true' className='h-5 w-5 text-gray-400' />
          </span>
        </ListboxButton>
        <ListboxOptions
          anchor='bottom end'
          transition
          className={classNames(
            'min-w-fitorigin-top-right relative z-10 mt-2 overflow-auto rounded-md border border-white/5 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-hidden',
            'transition duration-200 ease-in-out data-leave:data-closed:opacity-0',
            'ring-opacity-5 mt-1 ring-1 ring-black'
          )}
        >
          {options.map((option, index) => (
            <ListboxOption
              key={index}
              value={option}
              className='group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white'
            >
              <CheckIcon
                className={classNames(
                  option.value == selected.value ? 'visible' : 'invisible',
                  'size-4 fill-gray-900 data-focus:text-indigo-600'
                )}
              />

              <div className='text-sm/6 font-normal group-data-selected:font-semibold'>
                {option.label}
              </div>
              {option.secondaryLabel && (
                <div className='text-sm/6 text-gray-500 group-data-focus:text-indigo-200'>
                  {option.secondaryLabel}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default SingleSelect;
