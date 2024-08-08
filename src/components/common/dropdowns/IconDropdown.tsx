import { FC } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, MenuSeparator } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';

export interface DropdownItemProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  showDivider?: boolean;
}

export interface IconDropdownProps {
  BtnIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  items: DropdownItemProps[];
}

const IconDropdown: FC<IconDropdownProps> = ({
  BtnIcon = EllipsisVerticalIcon,
  className = '',
  items,
}) => {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton
        className={classNames(
          'flex items-center rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100',
          className
        )}
      >
        <span className='sr-only'>Open options</span>
        <BtnIcon aria-hidden='true' className='h-5 w-5' />
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

export default IconDropdown;
