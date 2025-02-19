import { FC, FunctionComponent, SVGProps } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, MenuSeparator } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';

export interface DropdownItemProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  showDivider?: boolean;
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface IconDropdownProps {
  BtnIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  className?: string;
  items: DropdownItemProps[];
  menuClassName?: string;
  type?: 'rounded' | 'square';
}

const IconDropdown: FC<IconDropdownProps> = ({
  BtnIcon = EllipsisVerticalIcon,
  className = '',
  items,
  type = 'rounded',
  menuClassName = '',
}) => {
  const roundedClass = type === 'rounded' ? 'rounded-full' : 'rounded-md';
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton
        className={classNames(
          'flex items-center p-0.5 text-gray-400 hover:bg-magpie-light-50 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-100 data-[open]:bg-magpie-light-50 data-[open]:ring-2 data-[open]:ring-offset-2',
          className,
          roundedClass
        )}
      >
        <span className='sr-only'>Open options</span>
        <BtnIcon aria-hidden='true' className='h-5 w-5' />
      </MenuButton>

      <MenuItems
        className={classNames(
          'absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0',
          menuClassName
        )}
        transition
        anchor='bottom end'
      >
        {items.map((item, key) => (
          <div key={key} className='flex items-center gap-2'>
            {item.showDivider && <MenuSeparator className='my-1 h-px bg-gray-200' />}
            {item.label && (
              <MenuItem disabled={item.disabled}>
                <button
                  className={classNames(
                    item.disabled
                      ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                      : 'text-gray-700',
                    'group flex w-full flex-row items-center gap-4 px-4 py-2 text-left text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                  )}
                  onClick={item.onClick}
                >
                  {item.icon && <item.icon className='h-4 w-4' />}
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
