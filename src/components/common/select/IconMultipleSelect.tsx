import { FC, useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, Checkbox, Field, Label } from '@headlessui/react';
// import { Popover, PopoverButton, PopoverPanel, useClose } from '@headlessui/react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';

export interface SelectItems {
  label: string;
  value: string | number;
  secondaryLabel?: string;
  disabled?: boolean;
}

interface IconMultipleSelectProps {
  BtnIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  value: (string | number)[];
  options: SelectItems[];
  onClear?: () => void;
  onApply: (value: (string | number)[]) => void;
  className?: string;
}

const IconMultipleSelect: FC<IconMultipleSelectProps> = ({
  BtnIcon = FunnelIcon,
  options,
  value,
  onApply,
  className = '',
}) => {
  const [selected, setSelected] = useState<(string | number)[]>(value);
  const [inputValue, setInputValue] = useState<(string | number)[]>(value);

  useEffect(() => {
    setSelected(value);
    setInputValue(value);
  }, [value]);

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton
        className={classNames(
          'flex items-center p-1 rounded-sm text-gray-400',
          'hover:text-gray-600 hover:bg-magpie-light-50',
          'data-[open]:bg-magpie-light-50 data-[open]:ring-2 data-[open]:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-100',
          'shadow-sm transition duration-150 ease-in-out',
          className
        )}
      >
        <span className='sr-only'>Open filter options</span>
        <BtnIcon className='h-5 w-5 ' />
      </MenuButton>

      <MenuItems
        transition
        className='absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] data-[closed]:scale-95 data-[closed]:opacity-0'
        anchor='bottom end'
      >
        <div className='text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-2 pb-2 px-3'>
          Filters
        </div>
        {options.map((option, key) => (
          <div
            key={key}
            className={classNames(
              'py-1 px-2 hover:bg-gray-100 ',
              option.disabled ? 'bg-gray-100 ' : ''
            )}
          >
            {option.label && (
              <Field className={classNames('flex items-center w-full')}>
                <Checkbox
                  as='button'
                  checked={selected.some((item) => item === option.value)}
                  onChange={(checked) => {
                    if (checked) {
                      setSelected([...selected, option.value]);
                    } else {
                      setSelected(selected.filter((item) => item !== option.value));
                    }
                  }}
                  disabled={option.disabled || false}
                  className='group p-[1px] size-4 rounded border bg-gray-100 border-gray-300 cursor-pointer data-[checked]:bg-blue-600 data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:cursor-not-allowed'
                >
                  <svg
                    className='stroke-white opacity-0 group-data-[checked]:opacity-100'
                    viewBox='0 0 14 14'
                    fill='none'
                  >
                    <path
                      d='M3 8L6 11L11 3.5'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='inherit'
                    />
                  </svg>
                </Checkbox>

                <Label className='flex flex-row flex-grow items-center'>
                  <div
                    className={classNames(
                      'px-2 text-sm font-normal rounded data-[selected]:font-semibold group-data-[selected]:font-semibold',
                      option.disabled
                        ? 'text-gray-500 cursor-not-allowed '
                        : 'text-gray-900 cursor-pointer '
                    )}
                  >
                    {option.label}
                  </div>

                  {option.secondaryLabel && (
                    <div
                      className={classNames(
                        'text-xs text-gray-500 data-[selected]:font-semibold group-data-[focus]:text-indigo-200',
                        option.disabled ? 'cursor-not-allowed ' : 'cursor-pointer '
                      )}
                    >
                      {option.secondaryLabel}
                    </div>
                  )}
                </Label>
              </Field>
            )}
          </div>
        ))}

        <div className='py-2 px-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/20'>
          <ul className='flex items-center justify-between'>
            <li>
              <button
                className='btn-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-200'
                onClick={() => setSelected(inputValue)}
              >
                Reset
              </button>
            </li>
            <li>
              <MenuItem>
                {({ close }) => (
                  <button
                    className='btn-xs bg-indigo-500 hover:bg-indigo-600 text-white'
                    onClick={() => {
                      close();
                      onApply(selected);
                    }}
                  >
                    Apply
                  </button>
                )}
              </MenuItem>
            </li>
          </ul>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default IconMultipleSelect;
