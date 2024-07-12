import { FC, Fragment } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, MenuSeparator } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/utils';

export interface DropdownItemProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  showDivider?: boolean;
}

export interface DropdownProps {
  label: string;
  className?: string;
  items: DropdownItemProps[];
}

const Dropdown: FC<DropdownProps> = ({ label, className = '', items }) => {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton as={Fragment}>
        {({ active }) => (
          <div
            className={classNames(
              'inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none data-[hover]:bg-gray-70 data-[open]:bg-gray-70 data-[focus]:outline-1 data-[focus]:outline-white',
              className,
              active ? 'bg-gray-100' : 'bg-white'
            )}
          >
            {label}
            <ChevronDownIcon
              className={classNames(
                '-mr-1 h-5 w-5 text-gray-400 transition-transform duration-300',
                active ? '-rotate-180' : 'rotate-0'
              )}
              aria-hidden='true'
            />
          </div>
        )}
      </MenuButton>

      <MenuItems
        className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] data-[closed]:scale-95 data-[closed]:opacity-0'
        transition
        anchor='bottom end'
      >
        {items.map((item, key) => (
          <div key={key}>
            {item.showDivider && <MenuSeparator className='my-1 h-px bg-gray-200' />}
            {item.label && (
              <MenuItem disabled={item.disabled}>
                <button
                  className={classNames(
                    item.disabled ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex w-full px-4 py-2 text-left text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
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
