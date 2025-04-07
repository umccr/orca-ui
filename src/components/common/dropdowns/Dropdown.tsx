import { FC } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, MenuSeparator } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';

export interface DropdownItemProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  showDivider?: boolean;
}

export interface DropdownProps {
  floatingLabel?: string;
  floatingLabelClassName?: string;
  value: string;
  className?: string;
  menuButtonClassName?: string;
  menuItemsClassName?: string;
  items: DropdownItemProps[];
}

const Dropdown: FC<DropdownProps> = ({
  floatingLabel,
  floatingLabelClassName,
  value,
  className = '',
  menuButtonClassName = '',
  menuItemsClassName = '',
  items,
}) => {
  return (
    <Menu
      as='div'
      className={classNames('relative inline-block w-full min-w-2 text-left', className)}
    >
      {floatingLabel && (
        <label
          className={classNames(
            'absolute start-1 top-2 z-2 origin-[0] -translate-y-4 scale-75',
            'bg-white px-2 text-sm dark:bg-gray-800',
            'text-gray-500 dark:text-gray-400',
            floatingLabelClassName
          )}
        >
          {floatingLabel}
        </label>
      )}
      <MenuButton as={'div'} className='w-full'>
        {({ open }) => (
          <div
            className={classNames(
              'inline-flex w-full items-center justify-between gap-x-1.5',
              'rounded-md px-3 py-2 text-sm font-medium',
              'bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-gray-100',
              'border border-gray-200 dark:border-gray-700',
              'transition-all duration-200',
              'hover:bg-gray-50 dark:hover:bg-gray-700/50',
              'cursor-pointer',
              open && 'bg-gray-50 dark:bg-gray-700/50',
              open && 'ring-2 ring-blue-500/30 dark:ring-blue-400/30',
              menuButtonClassName
            )}
          >
            {value}
            <ChevronDownIcon
              className={classNames(
                'h-5 w-5',
                'text-gray-400 dark:text-gray-500',
                'transition-transform duration-200',
                open ? 'rotate-180' : 'rotate-0'
              )}
              aria-hidden='true'
            />
          </div>
        )}
      </MenuButton>

      <MenuItems
        className={classNames(
          'absolute right-0 z-10 mt-0.5 w-56 origin-top-right',
          'overflow-hidden rounded-lg',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'shadow-lg dark:shadow-black/20',
          'divide-y divide-gray-100 dark:divide-gray-700',
          'focus:outline-none',
          '[--anchor-gap:0.5rem]',
          'transition duration-200 ease-out',
          'data-closed:scale-95 data-closed:opacity-0',
          menuItemsClassName
        )}
        transition
        anchor='bottom end'
      >
        {items.map((item, key) => (
          <div key={key}>
            {item.showDivider && (
              <MenuSeparator className='my-1 h-px bg-gray-200 dark:bg-gray-700' />
            )}
            {item.label && (
              <MenuItem disabled={item.disabled}>
                <button
                  className={classNames(
                    'group flex w-full items-center px-4 py-2.5 text-left text-sm',
                    'transition-colors duration-200',
                    item.disabled && [
                      'cursor-not-allowed',
                      'bg-gray-50/50 dark:bg-gray-800/50',
                      'text-gray-400 dark:text-gray-500',
                    ],
                    !item.disabled && [
                      'text-gray-700 dark:text-gray-200',
                      'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                      'hover:text-gray-900 dark:hover:text-white',
                      'data-focus:bg-blue-50 dark:data-focus:bg-blue-900/20',
                      'data-focus:text-blue-700 dark:data-focus:text-blue-200',
                    ]
                  )}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              </MenuItem>
            )}
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default Dropdown;
