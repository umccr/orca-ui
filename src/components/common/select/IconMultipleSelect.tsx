import { FC, useState, useEffect, useMemo, FunctionComponent, SVGProps } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, Checkbox, Field, Label } from '@headlessui/react';
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
  menuButtonClassName?: string;
  menuItemsClassName?: string;
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
  menuButtonClassName = '',
  menuItemsClassName = '',
  hasSelectAllOption = false,
  selectAllOptionValue = '-1',
}) => {
  const [selected, setSelected] = useState<(string | number)[]>(selectedItemValues);

  useEffect(() => {
    setSelected(selectedItemValues);
  }, [selectedItemValues]);

  const hasSelected = useMemo(
    () => selected?.length > 0 && selected.some((item) => item !== selectAllOptionValue),
    [selected, selectAllOptionValue]
  );

  const selectedValues = useMemo(
    () =>
      options
        .filter((option) => selected?.includes(option.value?.toString()))
        .map(
          (option) => option.label + (option.secondaryLabel ? ` (${option.secondaryLabel})` : '')
        ),
    [options, selected]
  );

  return (
    <Menu as='div' className={classNames('relative inline-block text-left', className)}>
      <Tooltip
        text={
          selectedValues.length === 0 ||
          (selectedValues.length === 1 && selectedValues[0] === 'All workflows')
            ? 'All workflows selected'
            : `Filter by: ${selectedValues.join(', ')}`
        }
        position='top'
        background='light'
        className='z-50 max-w-[500px] min-w-[150px] whitespace-normal'
        size='small'
      >
        <MenuButton
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
            'transition-all duration-200',
            menuButtonClassName
          )}
        >
          <span className='sr-only'>Open filter options</span>
          {hasSelected ? (
            <SelectedBtnIcon className='h-5 w-5 text-blue-600 dark:text-blue-400' />
          ) : (
            <BtnIcon className='h-5 w-5' />
          )}
        </MenuButton>
      </Tooltip>

      <MenuItems
        transition
        className={classNames(
          'absolute right-0 z-10 mt-2 w-72 origin-top-right',
          'overflow-hidden rounded-lg',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'shadow-lg dark:shadow-black/20',
          'focus:outline-none',
          'transition duration-200 ease-out',
          'data-closed:scale-95 data-closed:opacity-0',
          menuItemsClassName
        )}
        anchor='bottom end'
      >
        <div className='border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/80'>
          <span className='text-xs font-semibold text-gray-500 uppercase dark:text-gray-400'>
            Filters
          </span>
        </div>

        <div className='max-h-[300px] overflow-y-auto'>
          {options.map((option, key) => (
            <div
              key={key}
              className={classNames(
                'px-2 py-1',
                'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                option.disabled ? 'bg-gray-50 dark:bg-gray-800/50' : ''
              )}
            >
              {option.label && (
                <Field className='flex w-full items-center gap-2'>
                  <Checkbox
                    checked={selected.includes(option.value)}
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
                    disabled={option.disabled}
                    className={classNames(
                      'group size-4 rounded-sm',
                      'border border-gray-300 dark:border-gray-600',
                      'bg-white dark:bg-gray-700',
                      'data-checked:bg-blue-600 dark:data-checked:bg-blue-500',
                      'data-disabled:cursor-not-allowed data-disabled:bg-gray-100 dark:data-disabled:bg-gray-800',
                      'data-disabled:text-gray-400 dark:data-disabled:text-gray-500',
                      'transition-colors duration-200'
                    )}
                  >
                    <svg
                      className='stroke-white opacity-0 group-data-checked:opacity-100'
                      viewBox='0 0 14 14'
                      fill='none'
                    >
                      <path
                        d='M3 8L6 11L11 3.5'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </Checkbox>

                  <Label className='flex grow items-center gap-2'>
                    <span
                      className={classNames(
                        'text-sm',
                        option.disabled
                          ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
                          : 'cursor-pointer text-gray-700 dark:text-gray-200'
                      )}
                    >
                      {option.label}
                    </span>

                    {option.secondaryLabel && (
                      <span
                        className={classNames(
                          'text-xs',
                          option.disabled
                            ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
                            : 'cursor-pointer text-gray-500 dark:text-gray-400'
                        )}
                      >
                        {option.secondaryLabel}
                      </span>
                    )}
                  </Label>
                </Field>
              )}
            </div>
          ))}
        </div>

        <div className='border-t border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/80'>
          <div className='flex items-center justify-between gap-2'>
            <button
              className={classNames(
                'rounded-md px-3 py-1.5 text-sm',
                'border border-gray-200 dark:border-gray-700',
                'bg-white dark:bg-gray-800',
                'text-gray-600 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                'hover:text-gray-700 dark:hover:text-gray-200',
                'transition-colors duration-200'
              )}
              onClick={() => setSelected([selectAllOptionValue])}
            >
              Reset
            </button>
            <MenuItem>
              {({ close }) => (
                <button
                  className={classNames(
                    'rounded-md px-3 py-1.5 text-sm font-medium',
                    'bg-blue-600 dark:bg-blue-500',
                    'text-white',
                    'hover:bg-blue-700 dark:hover:bg-blue-600',
                    'transition-colors duration-200'
                  )}
                  onClick={() => {
                    close();
                    onApply(selected);
                  }}
                >
                  Apply
                </button>
              )}
            </MenuItem>
          </div>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default IconMultipleSelect;
