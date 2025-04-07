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
  type?: 'rounded-sm' | 'square';
}

const IconDropdown: FC<IconDropdownProps> = ({
  BtnIcon = EllipsisVerticalIcon,
  className = '',
  items,
  type = 'rounded-sm',
  menuClassName = '',
}) => {
  const roundedClass = type === 'rounded-sm' ? 'rounded-full' : 'rounded-md';

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton
        className={classNames(
          'flex items-center justify-center p-0.5',
          'bg-white dark:bg-gray-800',
          'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
          'hover:bg-gray-50 dark:hover:bg-gray-700',
          'border border-gray-200 dark:border-gray-700',
          'shadow-sm hover:shadow-md dark:shadow-gray-900/30',
          'transition-all duration-200 ease-in-out',
          'focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:outline-none dark:focus:ring-blue-400/50 dark:focus:ring-offset-gray-800',
          'data-open:bg-gray-50 dark:data-open:bg-gray-700',
          'data-open:text-gray-900 dark:data-open:text-gray-100',
          'data-open:ring-2 data-open:ring-blue-500/50 dark:data-open:ring-blue-400/50',
          className,
          roundedClass
        )}
      >
        <span className='sr-only'>Open options</span>
        <BtnIcon aria-hidden='true' className='h-5 w-5' />
      </MenuButton>

      <MenuItems
        className={classNames(
          'absolute right-0 z-10 mt-0.5 w-56 origin-top-right',
          'overflow-hidden rounded-lg',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'shadow-lg dark:shadow-gray-900/30',
          'ring-1 ring-black/5 dark:ring-white/10',
          'focus:outline-none',
          'divide-y divide-gray-100 dark:divide-gray-700',
          '[--anchor-gap:0.5rem]',
          'transition duration-200 ease-out',
          'data-closed:scale-95 data-closed:opacity-0',
          menuClassName
        )}
        transition
        anchor='bottom end'
      >
        {items.map((item, key) => (
          <div key={key} className='flex items-center gap-2'>
            {item.showDivider && (
              <MenuSeparator className='my-1 h-px bg-gray-200 dark:bg-gray-700' />
            )}
            {item.label && (
              <MenuItem disabled={item.disabled}>
                <button
                  className={classNames(
                    'group flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm',
                    'transition-colors duration-200 ease-in-out',
                    item.disabled
                      ? 'cursor-not-allowed bg-gray-50/50 text-gray-400 dark:bg-gray-800/50 dark:text-gray-500'
                      : [
                          'text-gray-700 dark:text-gray-200',
                          'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                          'hover:text-gray-900 dark:hover:text-white',
                          'data-focus:bg-blue-50 dark:data-focus:bg-blue-900/20',
                          'data-focus:text-blue-700 dark:data-focus:text-blue-200',
                        ]
                  )}
                  onClick={item.onClick}
                >
                  {item.icon && (
                    <item.icon
                      className={classNames(
                        'h-4 w-4 flex-shrink-0',
                        item.disabled
                          ? 'text-gray-400 dark:text-gray-500'
                          : [
                              'text-gray-500 dark:text-gray-400',
                              'group-hover:text-gray-900 dark:group-hover:text-white',
                              'group-data-focus:text-blue-700 dark:group-data-focus:text-blue-200',
                            ]
                      )}
                    />
                  )}
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
