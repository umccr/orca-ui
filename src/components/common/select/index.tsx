import { useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';

export interface SelectItems {
  label: string;
  value: string;
  secondaryLabel?: string;
}

interface SelectProps {
  value: SelectItems;
  options: SelectItems[];
  onChange: (value: SelectItems) => void;
}

export function Select({ value, options, onChange }: SelectProps) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (value: SelectItems) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <div className='mx-auto min-w-72 '>
      <Listbox value={selected} onChange={handleSelect}>
        <ListboxButton
          className={classNames(
            'relative block w-full rounded-lg bg-white py-1.5 pr-8 pl-3 text-left text-sm/6 text-gray-900 ',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 ',
            'focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ',
            'shadow-sm ring-1 ring-inset ring-gray-300 '
          )}
        >
          {selected.label}
          <ChevronUpDownIcon
            className='group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-gray-900'
            aria-hidden='true'
          />
        </ListboxButton>
        <ListboxOptions
          anchor='bottom'
          transition
          className={classNames(
            'w-[var(--button-width)] rounded-xl border border-white/5 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
            'transition duration-200 ease-in-out data-[leave]:data-[closed]:opacity-0',
            'mt-1 ring-1 ring-black ring-opacity-5'
          )}
        >
          {options.map((option, index) => (
            <ListboxOption
              key={index}
              value={option}
              className=' group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none text-gray-900  data-[focus]:bg-indigo-600 data-[focus]:text-white'
            >
              <CheckIcon
                className={classNames(
                  option.value == selected.value ? ' visible ' : ' invisible ',
                  ' size-4 fill-gray-900 data-[focus]:text-indigo-600 '
                )}
              />

              <div className='text-sm/6 font-normal group-data-[selected]:font-semibold '>
                {option.label}
              </div>
              {option.secondaryLabel && (
                <div className='text-sm/6 text-gray-500 group-data-[focus]:text-indigo-200'>
                  {option.secondaryLabel}
                </div>
              )}
              {/* <div className='flex'>
                <span className='truncate font-normal group-data-[selected]:font-semibold'>
                  {option.label}
                </span>
                <span className='ml-2 truncate text-gray-500 group-data-[focus]:text-indigo-200'>
                  {option.label}
                </span>
              </div> */}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
