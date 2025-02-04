import { FC, useState, useEffect, useMemo, FunctionComponent, SVGProps } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, Checkbox, Field, Label } from '@headlessui/react';
// import { Popover, PopoverButton, PopoverPanel, useClose } from '@headlessui/react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { FunnelIcon as SolidFunnelIcon } from '@heroicons/react/24/solid';
import { classNames } from '@/utils/commonUtils';
import { Tooltip } from '@/components/common/tooltips';

export interface SelectItems {
  label: string;
  value: string | number;
  secondaryLabel?: string;
  disabled?: boolean;
}

interface IconMultipleSelectProps {
  selectedItemValues: (string | number)[];
  options: SelectItems[];
  onClear?: () => void;
  onApply: (value: (string | number)[]) => void;
  className?: string;
  BtnIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  SelectedBtnIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  selectAllOptionValue?: string | number;
  hasSelectAllOption?: boolean;
}

const IconMultipleSelect: FC<IconMultipleSelectProps> = ({
  BtnIcon = FunnelIcon,
  SelectedBtnIcon = SolidFunnelIcon,
  options,
  selectedItemValues,
  onApply,
  className = '',
  hasSelectAllOption = false,
  selectAllOptionValue = '-1',
}) => {
  const [selected, setSelected] = useState<(string | number)[]>(selectedItemValues);
  const [inputValue, setInputValue] = useState<(string | number)[]>(selectedItemValues);

  useEffect(() => {
    setSelected(selectedItemValues);
    setInputValue(selectedItemValues);
  }, [selectedItemValues]);

  const hasSelected = useMemo(
    () => selected?.length > 0 && selected.some((item) => item !== selectAllOptionValue),
    [selected, selectAllOptionValue]
  );

  const selectedValues = useMemo(
    () =>
      options
        .filter((option) => selected?.includes(option.value?.toString().split('.')[1]))
        .map(
          (option) => option.label + (option.secondaryLabel ? ` (${option.secondaryLabel})` : '')
        ),
    [options, selected]
  );

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <Tooltip
        text={`${selectedValues ? `Filter by: ${selectedValues.join(', ')}` : ''}`}
        position='top'
        background='light'
      >
        <MenuButton
          className={classNames(
            'inline-flex items-center rounded border border-slate-200 p-1.5 leading-5 text-gray-400 shadow-sm',
            'ring-1 ring-gray-300 ring-offset-0 ring-offset-gray-100',
            'hover:bg-magpie-light-50 hover:text-gray-600',
            'data-[open]:bg-magpie-light-50 data-[open]:ring-2 data-[open]:ring-offset-0',
            'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 focus:ring-offset-gray-100',
            'transition duration-150 ease-in-out',
            className
          )}
        >
          <span className='sr-only'>Open filter options</span>
          {hasSelected ? (
            <SelectedBtnIcon className='h-5 w-5 fill-blue-700' />
          ) : (
            <BtnIcon className='h-5 w-5' />
          )}
        </MenuButton>
      </Tooltip>

      <MenuItems
        transition
        className='absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'
        anchor='bottom end'
      >
        <div className='border-b border-gray-200 bg-gray-50 px-3 pb-2 pt-2 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500'>
          Filters
        </div>
        {options.map((option, key) => (
          <div
            key={key}
            className={classNames(
              'px-2 py-1 hover:bg-gray-100',
              option.disabled ? 'bg-gray-100' : ''
            )}
          >
            {option.label && (
              <Field className={classNames('flex w-full items-center', 'hover:bg-gray-100')}>
                <Checkbox
                  as='button'
                  checked={selected?.some((item) => item === option.value)}
                  onChange={(checked) => {
                    if (checked) {
                      const isSelectAll = option.value === selectAllOptionValue;
                      const hasSelectAll = selected.includes(selectAllOptionValue);

                      if (hasSelectAllOption) {
                        if (hasSelectAll) {
                          // 1. when select ietem other than remove select all value, and add option value
                          setSelected([
                            ...selected.filter((item) => item !== selectAllOptionValue),
                            option.value,
                          ]);
                        } else if (isSelectAll) {
                          // 2. when select all option is selected, remove all selected items, just add select all option
                          setSelected([selectAllOptionValue]);
                        } else {
                          // 3. when select all option is not selected, add option value
                          setSelected([...selected, option.value]);
                        }
                      } else {
                        setSelected([...selected, option.value]);
                      }
                    } else {
                      setSelected(selected.filter((item) => item !== option.value));
                    }
                  }}
                  disabled={option.disabled || false}
                  className='group size-4 cursor-pointer rounded border border-gray-300 bg-gray-100 p-[1px] data-[disabled]:cursor-not-allowed data-[checked]:bg-blue-600 data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400'
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

                <Label className='flex flex-grow flex-row items-center'>
                  <div
                    className={classNames(
                      'rounded px-2 text-sm font-normal data-[selected]:font-semibold group-data-[selected]:font-semibold',
                      option.disabled
                        ? 'cursor-not-allowed text-gray-500'
                        : 'cursor-pointer text-gray-900'
                    )}
                  >
                    {option.label}
                  </div>

                  {option.secondaryLabel && (
                    <div
                      className={classNames(
                        'text-xs text-gray-500 data-[selected]:font-semibold group-data-[focus]:text-indigo-200',
                        option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
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

        <div className='border-t border-slate-200 bg-slate-50 px-5 py-2 dark:border-slate-700 dark:bg-slate-700/20'>
          <ul className='flex items-center justify-between'>
            <li>
              <button
                className='btn-xs border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-200'
                onClick={() => setSelected(inputValue)}
              >
                Reset
              </button>
            </li>
            <li>
              <MenuItem>
                {({ close }) => (
                  <button
                    className='btn-xs bg-indigo-500 text-white hover:bg-indigo-600'
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
